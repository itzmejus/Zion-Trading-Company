"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteConfirmButton } from "@/components/shared/delete-confirm-button"
import { deleteQuotation } from "@/lib/actions/quotations"
import { formatCurrency, formatDate } from "@/lib/format"
import type { QuotationListItem } from "@/lib/data/quotations"

export function QuotationsTable({ quotations }: { quotations: QuotationListItem[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return quotations
    return quotations.filter(
      (quote) =>
        quote.quote_number.toLowerCase().includes(q) ||
        quote.customer_name.toLowerCase().includes(q)
    )
  }, [quotations, query])

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search quote number or company..."
          className="pl-8"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote #</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No quotations found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((quotation) => (
              <TableRow key={quotation.id}>
                <TableCell className="font-medium">
                  <Link href={`/quotations/${quotation.id}`} className="hover:underline">
                    {quotation.quote_number}
                  </Link>
                </TableCell>
                <TableCell>{quotation.customer_name}</TableCell>
                <TableCell>{formatDate(quotation.quote_date)}</TableCell>
                <TableCell className="text-right">{formatCurrency(quotation.grand_total)}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DeleteConfirmButton
                      itemLabel="Quotation"
                      onConfirm={() => deleteQuotation(quotation.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
