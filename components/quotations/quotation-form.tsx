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
import { QuotationLineItemRow } from "@/components/quotations/quotation-line-item-row"
import { createQuotation } from "@/lib/actions/quotations"
import { computeQuoteLineTotal, computeQuoteTotals } from "@/lib/quotation-calc"
import { formatCurrency } from "@/lib/format"
import type { CompanyProfile, Customer, Product } from "@/lib/types/database"

export interface QuotationLineState {
  key: string
  product_id: string | null
  item_name: string
  qty: number
  rate: number
  discount_percent: number
}

function emptyLine(): QuotationLineState {
  return {
    key: crypto.randomUUID(),
    product_id: null,
    item_name: "",
    qty: 1,
    rate: 0,
    discount_percent: 0,
  }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function QuotationForm({
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
  const [quoteDate, setQuoteDate] = useState(todayISO())
  const [notes, setNotes] = useState("")
  const [lines, setLines] = useState<QuotationLineState[]>([emptyLine()])
  const [isSaving, setIsSaving] = useState(false)

  const computed = useMemo(
    () =>
      lines.map((line) => ({
        line,
        total: computeQuoteLineTotal({
          qty: line.qty,
          rate: line.rate,
          discountPercent: line.discount_percent,
        }),
      })),
    [lines]
  )

  const totals = useMemo(
    () =>
      computeQuoteTotals(
        computed.map(({ line, total }) => ({
          qty: line.qty,
          rate: line.rate,
          discountPercent: line.discount_percent,
          total,
        }))
      ),
    [computed]
  )

  function updateLine(key: string, patch: Partial<QuotationLineState>) {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)))
  }

  function removeLine(key: string) {
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.key !== key) : prev))
  }

  async function handleSubmit() {
    if (!customerId) {
      toast.error("Select a company to quote")
      return
    }
    if (lines.some((l) => !l.item_name.trim())) {
      toast.error("Every line needs an item name")
      return
    }

    setIsSaving(true)
    const result = await createQuotation({
      customer_id: customerId,
      quote_date: quoteDate,
      notes,
      items: lines.map((l) => ({
        product_id: l.product_id,
        item_name: l.item_name,
        qty: l.qty,
        rate: l.rate,
        discount_percent: l.discount_percent,
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quotation details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Quote for</Label>
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
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Quote date</Label>
            <Input
              type="date"
              value={quoteDate}
              onChange={(e) => setQuoteDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {computed.map(({ line, total }) => (
              <QuotationLineItemRow
                key={line.key}
                line={line}
                total={total}
                products={products}
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
            placeholder="Optional notes for this quotation"
          />
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} disabled={isSaving} size="lg">
        {isSaving ? "Saving..." : "Save quotation"}
      </Button>
    </div>
  )
}
