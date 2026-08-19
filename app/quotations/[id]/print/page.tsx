import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { QuotationPrintTemplate } from "@/components/print/quotation-print-template"
import { PrintButton } from "@/components/print/print-button"
import { getQuotationWithDetails } from "@/lib/data/quotations"
import { getCompanyProfile } from "@/lib/data/company-profile"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const quotation = await getQuotationWithDetails(id)
  return { title: quotation ? `Quotation ${quotation.quote_number}` : "Quotation" }
}

export default async function QuotationPrintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [quotation, companyProfile] = await Promise.all([
    getQuotationWithDetails(id),
    getCompanyProfile(),
  ])

  if (!quotation) notFound()

  return (
    <div className="bg-muted/40 py-6 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex w-full max-w-[210mm] flex-col gap-2 px-4 print:hidden">
        <div className="flex justify-end">
          <PrintButton />
        </div>
        <p className="text-sm text-muted-foreground">
          Tip: in the print dialog, open &ldquo;More settings&rdquo; and turn off &ldquo;Headers and
          footers&rdquo; so the page URL and date don&apos;t appear on the printed quotation.
        </p>
      </div>
      <QuotationPrintTemplate quotation={quotation} companyProfile={companyProfile} />
    </div>
  )
}
