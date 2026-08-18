import { notFound } from "next/navigation"
import { InvoicePrintTemplate } from "@/components/print/invoice-print-template"
import { PrintButton } from "@/components/print/print-button"
import { getInvoiceWithDetails } from "@/lib/data/invoices"
import { getCompanyProfile } from "@/lib/data/company-profile"

export default async function InvoicePrintPage({
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
    <div className="min-h-screen bg-muted/40 py-6">
      <div className="mx-auto mb-4 flex w-full max-w-[210mm] justify-end px-4 print:hidden">
        <PrintButton />
      </div>
      <InvoicePrintTemplate invoice={invoice} companyProfile={companyProfile} />
    </div>
  )
}
