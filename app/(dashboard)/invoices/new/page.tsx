import { InvoiceForm } from "@/components/invoices/invoice-form"
import { getCustomers } from "@/lib/data/customers"
import { getProducts } from "@/lib/data/products"
import { getCompanyProfile } from "@/lib/data/company-profile"

export default async function NewInvoicePage() {
  const [customers, products, companyProfile] = await Promise.all([
    getCustomers(),
    getProducts(),
    getCompanyProfile(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Bill</h1>
        <p className="text-sm text-muted-foreground">
          Create a GST bill for one of your companies.
        </p>
      </div>

      <InvoiceForm customers={customers} products={products} companyProfile={companyProfile} />
    </div>
  )
}
