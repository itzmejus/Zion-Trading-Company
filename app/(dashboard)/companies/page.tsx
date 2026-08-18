import { CustomersTable } from "@/components/companies/customers-table"
import { CustomerFormDialog } from "@/components/companies/customer-form-dialog"
import { getCustomers } from "@/lib/data/customers"

export default async function CompaniesPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
          <p className="text-sm text-muted-foreground">
            Customers you raise bills and quotations for.
          </p>
        </div>
        <CustomerFormDialog />
      </div>

      <CustomersTable customers={customers} />
    </div>
  )
}
