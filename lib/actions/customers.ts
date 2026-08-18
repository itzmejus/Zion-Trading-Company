"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { customerSchema, type CustomerValues } from "@/lib/validation/customer"

export async function createCustomer(values: CustomerValues) {
  const parsed = customerSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" }

  const supabase = await createClient()
  const { error } = await supabase.from("customers").insert(parsed.data)
  if (error) return { error: error.message }

  revalidatePath("/companies")
  return { error: null }
}

export async function updateCustomer(id: string, values: CustomerValues) {
  const parsed = customerSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" }

  const supabase = await createClient()
  const { error } = await supabase.from("customers").update(parsed.data).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/companies")
  return { error: null }
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("customers").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/companies")
  return { error: null }
}
