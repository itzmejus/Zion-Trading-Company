import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Required"),
  hsn_code: z.string().optional(),
  unit: z.string().min(1, "Required"),
  supplier_name: z.string().optional(),
  landing_cost: z.number().min(0, "Must be 0 or more"),
  selling_cost: z.number().min(0, "Must be 0 or more"),
  sgst_percent: z.number().min(0).max(100),
  cgst_percent: z.number().min(0).max(100),
  stock_qty: z.number().min(0, "Must be 0 or more"),
})

export type ProductValues = z.infer<typeof productSchema>
