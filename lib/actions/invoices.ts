"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { nextDocumentNumber } from "@/lib/numbering"
import { computeLineItem, computeDocumentTotals } from "@/lib/gst"
import { invoiceInputSchema, type InvoiceInput } from "@/lib/validation/invoice"

export async function createInvoice(input: InvoiceInput) {
  const parsed = invoiceInputSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" }
  const { customer_id, invoice_date, bill_type, notes, items } = parsed.data

  const supabase = await createClient()

  const [{ data: profile, error: profileErr }, { data: customer, error: customerErr }] =
    await Promise.all([
      supabase.from("company_profile").select("state, invoice_prefix").limit(1).single(),
      supabase.from("customers").select("state").eq("id", customer_id).single(),
    ])

  if (profileErr) return { error: profileErr.message }
  if (customerErr) return { error: customerErr.message }

  const sameState = !!profile.state && profile.state === customer.state

  const computed = items.map((item) => ({
    item,
    calc: computeLineItem(
      {
        qty: item.qty,
        rate: item.rate,
        discountPercent: item.discount_percent,
        sgstPercent: item.sgst_percent,
        cgstPercent: item.cgst_percent,
      },
      sameState
    ),
  }))

  const totals = computeDocumentTotals(
    computed.map(({ item, calc }) => ({
      qty: item.qty,
      rate: item.rate,
      discountPercent: item.discount_percent,
      sgstPercent: item.sgst_percent,
      cgstPercent: item.cgst_percent,
      ...calc,
    }))
  )

  let invoiceNumber: string
  try {
    invoiceNumber = await nextDocumentNumber(
      supabase,
      "invoice",
      profile.invoice_prefix,
      new Date(invoice_date)
    )
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to generate invoice number" }
  }

  const { data: invoice, error: insertError } = await supabase
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      invoice_date,
      bill_type,
      customer_id,
      notes: notes ?? "",
      subtotal: totals.subtotal,
      discount_total: totals.discountTotal,
      cgst_total: totals.cgstTotal,
      sgst_total: totals.sgstTotal,
      igst_total: totals.igstTotal,
      grand_total: totals.grandTotal,
    })
    .select("id")
    .single()

  if (insertError) return { error: insertError.message }

  const itemRows = computed.map(({ item, calc }, index) => ({
    invoice_id: invoice.id,
    product_id: item.product_id ?? null,
    item_name: item.item_name,
    hsn_code: item.hsn_code ?? "",
    qty: item.qty,
    rate: item.rate,
    discount_percent: item.discount_percent,
    sgst_percent: item.sgst_percent,
    cgst_percent: item.cgst_percent,
    cgst_amount: calc.cgstAmount,
    sgst_amount: calc.sgstAmount,
    igst_amount: calc.igstAmount,
    gross_amount: calc.gross,
    total_amount: calc.total,
    sort_order: index,
  }))

  const { error: itemsError } = await supabase.from("invoice_items").insert(itemRows)
  if (itemsError) return { error: itemsError.message }

  await Promise.all(
    computed
      .filter(({ item }) => item.product_id)
      .map(async ({ item }) => {
        const { data: product } = await supabase
          .from("products")
          .select("stock_qty")
          .eq("id", item.product_id!)
          .single()
        if (product) {
          await supabase
            .from("products")
            .update({ stock_qty: Math.max(0, product.stock_qty - item.qty) })
            .eq("id", item.product_id!)
        }
      })
  )

  revalidatePath("/invoices")
  revalidatePath("/stock")
  redirect(`/invoices/${invoice.id}`)
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from("invoice_items")
    .select("product_id, qty")
    .eq("invoice_id", id)

  const { error } = await supabase.from("invoices").delete().eq("id", id)
  if (error) return { error: error.message }

  await Promise.all(
    (items ?? [])
      .filter((i) => i.product_id)
      .map(async (i) => {
        const { data: product } = await supabase
          .from("products")
          .select("stock_qty")
          .eq("id", i.product_id!)
          .single()
        if (product) {
          await supabase
            .from("products")
            .update({ stock_qty: product.stock_qty + i.qty })
            .eq("id", i.product_id!)
        }
      })
  )

  revalidatePath("/invoices")
  revalidatePath("/stock")
  return { error: null }
}
