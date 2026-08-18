import { z } from "zod"

export const invoiceItemInputSchema = z.object({
  product_id: z.string().uuid().nullable().optional(),
  item_name: z.string().min(1, "Required"),
  hsn_code: z.string().optional(),
  qty: z.number().positive("Must be greater than 0"),
  rate: z.number().min(0),
  discount_percent: z.number().min(0).max(100),
  sgst_percent: z.number().min(0).max(100),
  cgst_percent: z.number().min(0).max(100),
})

export const invoiceInputSchema = z.object({
  customer_id: z.string().uuid("Select a company"),
  invoice_date: z.string().min(1),
  bill_type: z.enum(["cash", "credit"]),
  notes: z.string().optional(),
  items: z.array(invoiceItemInputSchema).min(1, "Add at least one item"),
})

export type InvoiceItemInput = z.infer<typeof invoiceItemInputSchema>
export type InvoiceInput = z.infer<typeof invoiceInputSchema>
