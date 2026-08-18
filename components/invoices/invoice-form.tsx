"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CustomerCombobox } from "@/components/shared/customer-combobox"
import { InvoiceLineItemRow } from "@/components/invoices/invoice-line-item-row"
import { createInvoice } from "@/lib/actions/invoices"
import { computeLineItem, computeDocumentTotals } from "@/lib/gst"
import { formatCurrency } from "@/lib/format"
import type { CompanyProfile, Customer, Product } from "@/lib/types/database"
import type { BillType } from "@/lib/types/database"

export interface InvoiceLineState {
  key: string
  product_id: string | null
  item_name: string
  hsn_code: string
  qty: number
  rate: number
  discount_percent: number
  sgst_percent: number
  cgst_percent: number
}

function emptyLine(): InvoiceLineState {
  return {
    key: crypto.randomUUID(),
    product_id: null,
    item_name: "",
    hsn_code: "",
    qty: 1,
    rate: 0,
    discount_percent: 0,
    sgst_percent: 9,
    cgst_percent: 9,
  }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function InvoiceForm({
  customers,
  products,
  companyProfile,
}: {
  customers: Customer[]
  products: Product[]
  companyProfile: CompanyProfile
}) {
  const [customerId, setCustomerId] = useState<string | undefined>()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [invoiceDate, setInvoiceDate] = useState(todayISO())
  const [billType, setBillType] = useState<BillType>("cash")
  const [notes, setNotes] = useState("")
  const [lines, setLines] = useState<InvoiceLineState[]>([emptyLine()])
  const [isSaving, setIsSaving] = useState(false)

  const sameState =
    !!companyProfile.state &&
    !!selectedCustomer?.state &&
    companyProfile.state === selectedCustomer.state

  const computed = useMemo(
    () =>
      lines.map((line) => ({
        line,
        calc: computeLineItem(
          {
            qty: line.qty,
            rate: line.rate,
            discountPercent: line.discount_percent,
            sgstPercent: line.sgst_percent,
            cgstPercent: line.cgst_percent,
          },
          sameState
        ),
      })),
    [lines, sameState]
  )

  const totals = useMemo(
    () =>
      computeDocumentTotals(
        computed.map(({ line, calc }) => ({
          qty: line.qty,
          rate: line.rate,
          discountPercent: line.discount_percent,
          sgstPercent: line.sgst_percent,
          cgstPercent: line.cgst_percent,
          ...calc,
        }))
      ),
    [computed]
  )

  function updateLine(key: string, patch: Partial<InvoiceLineState>) {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)))
  }

  function removeLine(key: string) {
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.key !== key) : prev))
  }

  async function handleSubmit() {
    if (!customerId) {
      toast.error("Select a company to bill")
      return
    }
    if (lines.some((l) => !l.item_name.trim())) {
      toast.error("Every line needs an item name")
      return
    }

    setIsSaving(true)
    const result = await createInvoice({
      customer_id: customerId,
      invoice_date: invoiceDate,
      bill_type: billType,
      notes,
      items: lines.map((l) => ({
        product_id: l.product_id,
        item_name: l.item_name,
        hsn_code: l.hsn_code,
        qty: l.qty,
        rate: l.rate,
        discount_percent: l.discount_percent,
        sgst_percent: l.sgst_percent,
        cgst_percent: l.cgst_percent,
      })),
    })
    setIsSaving(false)

    if (result?.error) {
      toast.error(result.error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{companyProfile.company_name}</CardTitle>
        </CardHeader>
        <CardContent className="text-base text-muted-foreground">
          {[companyProfile.address, companyProfile.city, companyProfile.state, companyProfile.pincode]
            .filter(Boolean)
            .join(", ") || "Add your address in Settings"}
          {companyProfile.gstin && <div>GSTIN: {companyProfile.gstin}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bill details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Bill to</Label>
            <CustomerCombobox
              customers={customers}
              value={customerId}
              onChange={(customer) => {
                setCustomerId(customer.id)
                setSelectedCustomer(customer)
              }}
            />
            {selectedCustomer && (
              <p className="text-base text-muted-foreground">
                {[selectedCustomer.address, selectedCustomer.city, selectedCustomer.state, selectedCustomer.pincode]
                  .filter(Boolean)
                  .join(", ")}
                {selectedCustomer.gstin && <> · GSTIN: {selectedCustomer.gstin}</>}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Bill date</Label>
            <Input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Bill type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={billType === "cash" ? "default" : "outline"}
                onClick={() => setBillType("cash")}
                className="flex-1"
              >
                Cash
              </Button>
              <Button
                type="button"
                variant={billType === "credit" ? "default" : "outline"}
                onClick={() => setBillType("credit")}
                className="flex-1"
              >
                Credit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {computed.map(({ line, calc }) => (
              <InvoiceLineItemRow
                key={line.key}
                line={line}
                calc={calc}
                products={products}
                sameState={sameState}
                onChange={(patch) => updateLine(line.key, patch)}
                onRemove={() => removeLine(line.key)}
                canRemove={lines.length > 1}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLines((prev) => [...prev, emptyLine()])}
          >
            <Plus className="size-4" />
            Add line
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="ml-auto max-w-sm space-y-2 pt-6 text-base">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span>- {formatCurrency(totals.discountTotal)}</span>
          </div>
          {sameState ? (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CGST</span>
                <span>{formatCurrency(totals.cgstTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SGST</span>
                <span>{formatCurrency(totals.sgstTotal)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-muted-foreground">IGST</span>
              <span>{formatCurrency(totals.igstTotal)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 text-lg font-bold">
            <span>Grand total</span>
            <span>{formatCurrency(totals.grandTotal)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes for this bill"
          />
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} disabled={isSaving} size="lg">
        {isSaving ? "Saving..." : "Save bill"}
      </Button>
    </div>
  )
}
