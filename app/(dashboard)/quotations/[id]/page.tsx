import { notFound } from "next/navigation"
import { ArrowLeft, Printer } from "lucide-react"

import { QuotationPrintTemplate } from "@/components/print/quotation-print-template"
import { DeleteConfirmButton } from "@/components/shared/delete-confirm-button"
import { LinkButton } from "@/components/shared/link-button"
import { getQuotationWithDetails } from "@/lib/data/quotations"
import { getCompanyProfile } from "@/lib/data/company-profile"
import { deleteQuotation } from "@/lib/actions/quotations"

export default async function QuotationDetailPage({
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <LinkButton variant="ghost" href="/quotations">
          <ArrowLeft className="size-4" />
          Back to Quotations
        </LinkButton>
        <div className="flex gap-2">
          <LinkButton variant="outline" href={`/quotations/${id}/print`} target="_blank">
            <Printer className="size-4" />
            Print
          </LinkButton>
          <DeleteConfirmButton
            itemLabel="Quotation"
            onConfirm={deleteQuotation.bind(null, id)}
            redirectTo="/quotations"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-muted/30 p-4">
        <QuotationPrintTemplate quotation={quotation} companyProfile={companyProfile} />
      </div>
    </div>
  )
}
