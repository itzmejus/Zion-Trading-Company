"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { nextDocumentNumber } from "@/lib/numbering"
import { computeQuoteLineTotal, computeQuoteTotals } from "@/lib/quotation-calc"
import { quotationInputSchema, type QuotationInput } from "@/lib/validation/quotation"

export async function createQuotation(input: QuotationInput) {
  const parsed = quotationInputSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" }
  const { customer_id, quote_date, notes, items } = parsed.data

  const supabase = await createClient()

  const { data: profile, error: profileErr } = await supabase
    .from("company_profile")
    .select("quote_prefix")
    .limit(1)
    .single()

  if (profileErr) return { error: profileErr.message }

  const computed = items.map((item) => ({
    item,
    total: computeQuoteLineTotal({
      qty: item.qty,
      rate: item.rate,
      discountPercent: item.discount_percent,
    }),
  }))

  const totals = computeQuoteTotals(
    computed.map(({ item, total }) => ({
      qty: item.qty,
      rate: item.rate,
      discountPercent: item.discount_percent,
      total,
    }))
  )

  let quoteNumber: string
  try {
    quoteNumber = await nextDocumentNumber(
      supabase,
      "quote",
      profile.quote_prefix,
      new Date(quote_date)
    )
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to generate quote number" }
  }

  const { data: quotation, error: insertError } = await supabase
    .from("quotations")
    .insert({
      quote_number: quoteNumber,
      quote_date,
      customer_id,
      notes: notes ?? "",
      subtotal: totals.subtotal,
      discount_total: totals.discountTotal,
      grand_total: totals.grandTotal,
    })
    .select("id")
    .single()

  if (insertError) return { error: insertError.message }

  const itemRows = computed.map(({ item, total }, index) => ({
    quotation_id: quotation.id,
    product_id: item.product_id ?? null,
    item_name: item.item_name,
    qty: item.qty,
    rate: item.rate,
    discount_percent: item.discount_percent,
    total_amount: total,
    sort_order: index,
  }))

  const { error: itemsError } = await supabase.from("quotation_items").insert(itemRows)
  if (itemsError) return { error: itemsError.message }

  revalidatePath("/quotations")
  redirect(`/quotations/${quotation.id}`)
}

export async function deleteQuotation(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("quotations").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/quotations")
  return { error: null }
}
