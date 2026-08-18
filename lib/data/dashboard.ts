import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types/database"
import type { InvoiceListItem } from "@/lib/data/invoices"

const LOW_STOCK_THRESHOLD = 5

export interface DashboardStats {
  customerCount: number
  productCount: number
  invoiceCountThisMonth: number
  revenueThisMonth: number
  outstandingCredit: number
  lowStockProducts: Product[]
  recentInvoices: InvoiceListItem[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)

  const [
    { count: customerCount },
    { count: productCount },
    { data: invoicesThisMonth },
    { data: creditInvoices },
    { data: lowStockProducts },
    { data: recentInvoicesRaw },
    { data: customers },
  ] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("invoices").select("grand_total").gte("invoice_date", monthStart),
    supabase.from("invoices").select("grand_total").eq("bill_type", "credit"),
    supabase
      .from("products")
      .select("*")
      .lt("stock_qty", LOW_STOCK_THRESHOLD)
      .order("stock_qty", { ascending: true })
      .limit(5),
    supabase
      .from("invoices")
      .select("*")
      .order("invoice_date", { ascending: false })
      .limit(5),
    supabase.from("customers").select("id, name"),
  ])

  const nameById = new Map((customers ?? []).map((c) => [c.id, c.name]))
  const recentInvoices: InvoiceListItem[] = (recentInvoicesRaw ?? []).map((invoice) => ({
    ...invoice,
    customer_name: nameById.get(invoice.customer_id) ?? "Unknown",
  }))

  return {
    customerCount: customerCount ?? 0,
    productCount: productCount ?? 0,
    invoiceCountThisMonth: invoicesThisMonth?.length ?? 0,
    revenueThisMonth: (invoicesThisMonth ?? []).reduce((sum, i) => sum + i.grand_total, 0),
    outstandingCredit: (creditInvoices ?? []).reduce((sum, i) => sum + i.grand_total, 0),
    lowStockProducts: lowStockProducts ?? [],
    recentInvoices,
  }
}
