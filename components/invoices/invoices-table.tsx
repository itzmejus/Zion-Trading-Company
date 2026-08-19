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

      {filtered.length === 0 && (
        <div className="rounded-md border py-8 text-center text-muted-foreground">
          No bills found.
        </div>
      )}

      {/* Mobile: stacked cards */}
      <div className="space-y-3 sm:hidden">
        {filtered.map((invoice) => (
          <div key={invoice.id} className="space-y-2 rounded-md border p-4">
            <Link href={`/invoices/${invoice.id}`} className="block">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{invoice.invoice_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.customer_name} · {formatDate(invoice.invoice_date)}
                  </p>
                </div>
                <Badge variant={invoice.bill_type === "cash" ? "secondary" : "outline"}>
                  {invoice.bill_type}
                </Badge>
              </div>
            </Link>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="font-semibold">{formatCurrency(invoice.grand_total)}</span>
              <DeleteConfirmButton
                itemLabel="Bill"
                onConfirm={() => deleteInvoice(invoice.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: full table */}
      {filtered.length > 0 && (
        <div className="hidden rounded-md border sm:block">
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
      )}
    </div>
  )
}
