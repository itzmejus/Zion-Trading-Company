import { StockTable } from "@/components/stock/stock-table"
import { ProductFormDialog } from "@/components/stock/product-form-dialog"
import { getProducts } from "@/lib/data/products"

export default async function StockPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stock</h1>
          <p className="text-base text-muted-foreground">
            Products available for bills and quotations.
          </p>
        </div>
        <ProductFormDialog />
      </div>

      <StockTable products={products} />
    </div>
  )
}
