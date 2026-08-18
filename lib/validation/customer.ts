import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().min(1, "Required"),
  contact_person: z.string().optional(),
  gstin: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Enter a valid email").or(z.literal("")).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
})

export type CustomerValues = z.infer<typeof customerSchema>
