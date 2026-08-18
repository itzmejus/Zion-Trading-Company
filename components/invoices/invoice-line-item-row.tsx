"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductPickerButton } from "@/components/shared/product-picker-button"
import { formatCurrency } from "@/lib/format"
import type { LineItemComputed } from "@/lib/gst"
import type { Product } from "@/lib/types/database"
import type { InvoiceLineState } from "@/components/invoices/invoice-form"

export function InvoiceLineItemRow({
  line,
  calc,
  products,
  sameState,
  onChange,
  onRemove,
  canRemove,
}: {
  line: InvoiceLineState
  calc: LineItemComputed
  products: Product[]
  sameState: boolean
  onChange: (patch: Partial<InvoiceLineState>) => void
  onRemove: () => void
  canRemove: boolean
}) {
  function handlePickProduct(product: Product) {
    onChange({
      product_id: product.id,
      item_name: product.name,
      hsn_code: product.hsn_code,
      rate: product.selling_cost,
      sgst_percent: product.sgst_percent,
      cgst_percent: product.cgst_percent,
    })
  }

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">Item</Label>
          <Input
            value={line.item_name}
            onChange={(e) => onChange({ item_name: e.target.value, product_id: null })}
            placeholder="Item name"
          />
        </div>
        <ProductPickerButton products={products} onSelect={handlePickProduct} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          className="shrink-0"
        >
          <X className="size-4" />
          <span className="sr-only">Remove line</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">HSN</Label>
          <Input value={line.hsn_code} onChange={(e) => onChange({ hsn_code: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">Qty</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={line.qty}
            onChange={(e) => onChange({ qty: e.target.valueAsNumber || 0 })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">Rate</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={line.rate}
            onChange={(e) => onChange({ rate: e.target.valueAsNumber || 0 })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">Disc %</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={line.discount_percent}
            onChange={(e) => onChange({ discount_percent: e.target.valueAsNumber || 0 })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">SGST %</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={line.sgst_percent}
            onChange={(e) => onChange({ sgst_percent: e.target.valueAsNumber || 0 })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">CGST %</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={line.cgst_percent}
            onChange={(e) => onChange({ cgst_percent: e.target.valueAsNumber || 0 })}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t pt-2 text-base">
        <span className="text-muted-foreground">Gross: {formatCurrency(calc.gross)}</span>
        {sameState ? (
          <span className="text-muted-foreground">
            CGST {formatCurrency(calc.cgstAmount)} · SGST {formatCurrency(calc.sgstAmount)}
          </span>
        ) : (
          <span className="text-muted-foreground">IGST {formatCurrency(calc.igstAmount)}</span>
        )}
        <span className="font-semibold">Total: {formatCurrency(calc.total)}</span>
      </div>
    </div>
  )
}
