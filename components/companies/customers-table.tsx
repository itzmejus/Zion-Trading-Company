"use client"

import { useMemo, useState } from "react"
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
import { CustomerFormDialog } from "@/components/companies/customer-form-dialog"
import { DeleteConfirmButton } from "@/components/shared/delete-confirm-button"
import { deleteCustomer } from "@/lib/actions/customers"
import type { Customer } from "@/lib/types/database"

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.gstin.toLowerCase().includes(q) ||
        c.contact_person.toLowerCase().includes(q)
    )
  }, [customers, query])

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies, contact person, or GSTIN..."
          className="pl-8"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact person</TableHead>
              <TableHead>GSTIN</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No companies found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.contact_person || "—"}</TableCell>
                <TableCell>{customer.gstin || "—"}</TableCell>
                <TableCell>{customer.state || "—"}</TableCell>
                <TableCell>{customer.phone || "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <CustomerFormDialog customer={customer} />
                    <DeleteConfirmButton
                      itemLabel="Company"
                      onConfirm={() => deleteCustomer(customer.id)}
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
