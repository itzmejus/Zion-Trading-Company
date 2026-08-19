import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { InvoicePrintTemplate } from "@/components/print/invoice-print-template"
import { PrintButton } from "@/components/print/print-button"
import { getInvoiceWithDetails } from "@/lib/data/invoices"
import { getCompanyProfile } from "@/lib/data/company-profile"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const invoice = await getInvoiceWithDetails(id)
  return { title: invoice ? `Bill ${invoice.invoice_number}` : "Bill" }
}

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
    <div className="bg-muted/40 py-6 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex w-full max-w-[210mm] flex-col gap-2 px-4 print:hidden">
        <div className="flex justify-end">
          <PrintButton />
        </div>
        <p className="text-sm text-muted-foreground">
          Tip: in the print dialog, open &ldquo;More settings&rdquo; and turn off &ldquo;Headers and
          footers&rdquo; so the page URL and date don&apos;t appear on the printed bill.
        </p>
      </div>
      <InvoicePrintTemplate invoice={invoice} companyProfile={companyProfile} />
    </div>
  )
}
