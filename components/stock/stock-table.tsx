"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductFormDialog } from "@/components/stock/product-form-dialog"
import { DeleteConfirmButton } from "@/components/shared/delete-confirm-button"
import { deleteProduct } from "@/lib/actions/products"
import { formatCurrency } from "@/lib/format"
import type { Product } from "@/lib/types/database"

export function StockTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.hsn_code.toLowerCase().includes(q)
    )
  }, [products, query])

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products or HSN code..."
          className="pl-8"
        />
      </div>

      {filtered.length === 0 && (
        <div className="rounded-md border py-8 text-center text-muted-foreground">
          No products found.
        </div>
      )}

      {/* Mobile: stacked cards */}
      <div className="space-y-3 sm:hidden">
        {filtered.map((product) => (
          <div key={product.id} className="space-y-2 rounded-md border p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  HSN {product.hsn_code || "—"} · {product.unit}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <ProductFormDialog product={product} />
                <DeleteConfirmButton
                  itemLabel="Product"
                  onConfirm={() => deleteProduct(product.id)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-t pt-2 text-sm">
              <div>
                <span className="text-muted-foreground">Landing: </span>
                {formatCurrency(product.landing_cost)}
              </div>
              <div>
                <span className="text-muted-foreground">Selling: </span>
                {formatCurrency(product.selling_cost)}
              </div>
              <div>
                <span className="text-muted-foreground">SGST: </span>
                {product.sgst_percent}%
              </div>
              <div>
                <span className="text-muted-foreground">CGST: </span>
                {product.cgst_percent}%
              </div>
              <div>
                <span className="text-muted-foreground">Stock: </span>
                {product.stock_qty}
              </div>
              <div>
                <span className="text-muted-foreground">Supplier: </span>
                {product.supplier_name || "—"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: full table */}
      {filtered.length > 0 && (
        <div className="hidden rounded-md border sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>HSN</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Landing</TableHead>
                <TableHead className="text-right">Selling</TableHead>
                <TableHead className="text-right">SGST %</TableHead>
                <TableHead className="text-right">CGST %</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.hsn_code || "—"}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.supplier_name || "—"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.landing_cost)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.selling_cost)}</TableCell>
                  <TableCell className="text-right">{product.sgst_percent}%</TableCell>
                  <TableCell className="text-right">{product.cgst_percent}%</TableCell>
                  <TableCell className="text-right">{product.stock_qty}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <ProductFormDialog product={product} />
                      <DeleteConfirmButton
                        itemLabel="Product"
                        onConfirm={() => deleteProduct(product.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
