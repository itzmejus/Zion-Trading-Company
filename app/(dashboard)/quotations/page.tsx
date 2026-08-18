import { Plus } from "lucide-react"

import { LinkButton } from "@/components/shared/link-button"
import { QuotationsTable } from "@/components/quotations/quotations-table"
import { getQuotations } from "@/lib/data/quotations"

export default async function QuotationsPage() {
  const quotations = await getQuotations()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Quotations</h1>
          <p className="text-sm text-muted-foreground">Price quotes sent to your companies.</p>
        </div>
        <LinkButton href="/quotations/new">
          <Plus className="size-4" />
          New Quotation
        </LinkButton>
      </div>

      <QuotationsTable quotations={quotations} />
    </div>
  )
}
