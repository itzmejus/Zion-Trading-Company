"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductPickerButton } from "@/components/shared/product-picker-button"
import { formatCurrency } from "@/lib/format"
import { selectOnFocus } from "@/lib/utils"
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full space-y-1.5 sm:w-1/2">
          <Label className="text-sm font-medium text-muted-foreground">Item</Label>
          <Input
            value={line.item_name}
            onChange={(e) => onChange({ item_name: e.target.value, product_id: null })}
            placeholder="Item name"
          />
        </div>
        <div className="flex items-center gap-2">
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
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-muted-foreground">Qty</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={line.qty}
            onFocus={selectOnFocus}
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
            onFocus={selectOnFocus}
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
            onFocus={selectOnFocus}
            onChange={(e) => onChange({ discount_percent: e.target.valueAsNumber || 0 })}
          />
        </div>
      </div>

      <div className="flex items-center justify-end border-t pt-2 text-base font-semibold">
        Total: {formatCurrency(total)}
      </div>
    </div>
  )
}
