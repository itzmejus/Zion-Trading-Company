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

      <div className="rounded-md border">
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
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            )}
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
    </div>
  )
}
