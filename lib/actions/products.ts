"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { productSchema, type ProductValues } from "@/lib/validation/product"

export async function createProduct(values: ProductValues) {
  const parsed = productSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" }

  const supabase = await createClient()
  const { error } = await supabase.from("products").insert(parsed.data)
  if (error) return { error: error.message }

  revalidatePath("/stock")
  return { error: null }
}

export async function updateProduct(id: string, values: ProductValues) {
  const parsed = productSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" }

  const supabase = await createClient()
  const { error } = await supabase.from("products").update(parsed.data).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/stock")
  return { error: null }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/stock")
  return { error: null }
}
