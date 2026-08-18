"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteConfirmButton } from "@/components/shared/delete-confirm-button"
import { deleteInvoice } from "@/lib/actions/invoices"
import { formatCurrency, formatDate } from "@/lib/format"
import type { InvoiceListItem } from "@/lib/data/invoices"

export function InvoicesTable({ invoices }: { invoices: InvoiceListItem[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return invoices
    return invoices.filter(
      (inv) =>
        inv.invoice_number.toLowerCase().includes(q) ||
        inv.customer_name.toLowerCase().includes(q)
    )
  }, [invoices, query])

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bill number or company..."
          className="pl-8"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill #</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No bills found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  <Link href={`/invoices/${invoice.id}`} className="hover:underline">
                    {invoice.invoice_number}
                  </Link>
                </TableCell>
                <TableCell>{invoice.customer_name}</TableCell>
                <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
                <TableCell>
                  <Badge variant={invoice.bill_type === "cash" ? "secondary" : "outline"}>
                    {invoice.bill_type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.grand_total)}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DeleteConfirmButton
                      itemLabel="Bill"
                      onConfirm={() => deleteInvoice(invoice.id)}
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
