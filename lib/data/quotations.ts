import { createClient } from "@/lib/supabase/server"
import type { Customer, Quotation, QuotationItem } from "@/lib/types/database"

export interface QuotationListItem extends Quotation {
  customer_name: string
}

export async function getQuotations(): Promise<QuotationListItem[]> {
  const supabase = await createClient()
  const [{ data: quotations, error }, { data: customers, error: custErr }] =
    await Promise.all([
      supabase.from("quotations").select("*").order("quote_date", { ascending: false }),
      supabase.from("customers").select("id, name"),
    ])

  if (error) throw error
  if (custErr) throw custErr

  const nameById = new Map((customers ?? []).map((c) => [c.id, c.name]))
  return (quotations ?? []).map((quotation) => ({
    ...quotation,
    customer_name: nameById.get(quotation.customer_id) ?? "Unknown",
  }))
}

export interface QuotationWithDetails extends Quotation {
  customer: Customer
  items: QuotationItem[]
}

export async function getQuotationWithDetails(
  id: string
): Promise<QuotationWithDetails | null> {
  const supabase = await createClient()

  const { data: quotation, error } = await supabase
    .from("quotations")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw error
  if (!quotation) return null

  const [{ data: customer, error: custErr }, { data: items, error: itemsErr }] =
    await Promise.all([
      supabase.from("customers").select("*").eq("id", quotation.customer_id).single(),
      supabase
        .from("quotation_items")
        .select("*")
        .eq("quotation_id", id)
        .order("sort_order", { ascending: true }),
    ])

  if (custErr) throw custErr
  if (itemsErr) throw itemsErr

  return { ...quotation, customer, items: items ?? [] }
}
