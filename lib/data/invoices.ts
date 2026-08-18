import { createClient } from "@/lib/supabase/server"
import type { Customer, Invoice, InvoiceItem } from "@/lib/types/database"

export interface InvoiceListItem extends Invoice {
  customer_name: string
}

export async function getInvoices(): Promise<InvoiceListItem[]> {
  const supabase = await createClient()
  const [{ data: invoices, error }, { data: customers, error: custErr }] =
    await Promise.all([
      supabase.from("invoices").select("*").order("invoice_date", { ascending: false }),
      supabase.from("customers").select("id, name"),
    ])

  if (error) throw error
  if (custErr) throw custErr

  const nameById = new Map((customers ?? []).map((c) => [c.id, c.name]))
  return (invoices ?? []).map((invoice) => ({
    ...invoice,
    customer_name: nameById.get(invoice.customer_id) ?? "Unknown",
  }))
}

export interface InvoiceWithDetails extends Invoice {
  customer: Customer
  items: InvoiceItem[]
}

export async function getInvoiceWithDetails(
  id: string
): Promise<InvoiceWithDetails | null> {
  const supabase = await createClient()

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw error
  if (!invoice) return null

  const [{ data: customer, error: custErr }, { data: items, error: itemsErr }] =
    await Promise.all([
      supabase.from("customers").select("*").eq("id", invoice.customer_id).single(),
      supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", id)
        .order("sort_order", { ascending: true }),
    ])

  if (custErr) throw custErr
  if (itemsErr) throw itemsErr

  return { ...invoice, customer, items: items ?? [] }
}
