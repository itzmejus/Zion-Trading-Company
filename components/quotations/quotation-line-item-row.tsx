"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductPickerButton } from "@/components/shared/product-picker-button"
import { formatCurrency } from "@/lib/format"
import type { Product } from "@/lib/types/database"
import type { QuotationLineState } from "@/components/quotations/quotation-form"

export function QuotationLineItemRow({
  line,
  total,
  products,
  onChange,
  onRemove,
  canRemove,
}: {
  line: QuotationLineState
  total: number
  products: Product[]
  onChange: (patch: Partial<QuotationLineState>) => void
  onRemove: () => void
  canRemove: boolean
}) {
  function handlePickProduct(product: Product) {
    onChange({
      product_id: product.id,
      item_name: product.name,
      rate: product.selling_cost,
    })
  }

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs text-muted-foreground">Item</Label>
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

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Qty</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={line.qty}
            onChange={(e) => onChange({ qty: e.target.valueAsNumber || 0 })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Rate</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={line.rate}
            onChange={(e) => onChange({ rate: e.target.valueAsNumber || 0 })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Disc %</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={line.discount_percent}
            onChange={(e) => onChange({ discount_percent: e.target.valueAsNumber || 0 })}
          />
        </div>
      </div>

      <div className="flex items-center justify-end border-t pt-2 text-sm font-semibold">
        Total: {formatCurrency(total)}
      </div>
    </div>
  )
}
