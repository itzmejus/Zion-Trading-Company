import { notFound } from "next/navigation"
import { QuotationPrintTemplate } from "@/components/print/quotation-print-template"
import { PrintButton } from "@/components/print/print-button"
import { getQuotationWithDetails } from "@/lib/data/quotations"
import { getCompanyProfile } from "@/lib/data/company-profile"

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
    <div className="min-h-screen bg-muted/40 py-6">
      <div className="mx-auto mb-4 flex w-full max-w-[210mm] justify-end px-4 print:hidden">
        <PrintButton />
      </div>
      <QuotationPrintTemplate quotation={quotation} companyProfile={companyProfile} />
    </div>
  )
}
