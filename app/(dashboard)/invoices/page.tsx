import { Plus } from "lucide-react"

import { LinkButton } from "@/components/shared/link-button"
import { InvoicesTable } from "@/components/invoices/invoices-table"
import { getInvoices } from "@/lib/data/invoices"

export default async function InvoicesPage() {
  const invoices = await getInvoices()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bills</h1>
          <p className="text-sm text-muted-foreground">GST bills raised to your companies.</p>
        </div>
        <LinkButton href="/invoices/new">
          <Plus className="size-4" />
          New Bill
        </LinkButton>
      </div>

      <InvoicesTable invoices={invoices} />
    </div>
  )
}
