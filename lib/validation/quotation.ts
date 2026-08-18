import { z } from "zod"

export const quotationItemInputSchema = z.object({
  product_id: z.string().uuid().nullable().optional(),
  item_name: z.string().min(1, "Required"),
  qty: z.number().positive("Must be greater than 0"),
  rate: z.number().min(0),
  discount_percent: z.number().min(0).max(100),
})

export const quotationInputSchema = z.object({
  customer_id: z.string().uuid("Select a company"),
  quote_date: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(quotationItemInputSchema).min(1, "Add at least one item"),
})

export type QuotationItemInput = z.infer<typeof quotationItemInputSchema>
export type QuotationInput = z.infer<typeof quotationInputSchema>
