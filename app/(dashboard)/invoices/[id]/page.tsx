import { notFound } from "next/navigation"
import { ArrowLeft, Printer } from "lucide-react"

import { InvoicePrintTemplate } from "@/components/print/invoice-print-template"
import { DeleteConfirmButton } from "@/components/shared/delete-confirm-button"
import { LinkButton } from "@/components/shared/link-button"
import { getInvoiceWithDetails } from "@/lib/data/invoices"
import { getCompanyProfile } from "@/lib/data/company-profile"
import { deleteInvoice } from "@/lib/actions/invoices"

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [invoice, companyProfile] = await Promise.all([
    getInvoiceWithDetails(id),
    getCompanyProfile(),
  ])

  if (!invoice) notFound()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <LinkButton variant="ghost" href="/invoices">
          <ArrowLeft className="size-4" />
          Back to Bills
        </LinkButton>
        <div className="flex gap-2">
          <LinkButton variant="outline" href={`/invoices/${id}/print`} target="_blank">
            <Printer className="size-4" />
            Print
          </LinkButton>
          <DeleteConfirmButton
            itemLabel="Bill"
            onConfirm={deleteInvoice.bind(null, id)}
            redirectTo="/invoices"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-muted/30 p-4">
        <InvoicePrintTemplate invoice={invoice} companyProfile={companyProfile} />
      </div>
    </div>
  )
}
