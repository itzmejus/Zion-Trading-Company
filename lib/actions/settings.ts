"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/types/database"

type CompanyProfileUpdate = Database["public"]["Tables"]["company_profile"]["Update"]

async function getProfileId(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<string> {
  const { data, error } = await supabase
    .from("company_profile")
    .select("id")
    .limit(1)
    .single()

  if (error) throw error
  return data.id
}

export async function updateCompanyProfile(update: CompanyProfileUpdate) {
  const supabase = await createClient()
  const id = await getProfileId(supabase)

  const { error } = await supabase
    .from("company_profile")
    .update(update)
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/settings")
  revalidatePath("/(dashboard)", "layout")
  return { error: null }
}

export async function uploadSeal(formData: FormData) {
  const file = formData.get("file") as File | null
  if (!file || file.size === 0) return { error: "No file provided" }

  const supabase = await createClient()
  const id = await getProfileId(supabase)

  const ext = file.name.split(".").pop() || "png"
  const path = `seal.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("seal")
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) return { error: uploadError.message }

  const { data: publicUrlData } = supabase.storage.from("seal").getPublicUrl(path)
  const url = `${publicUrlData.publicUrl}?v=${Date.now()}`

  const { error: updateError } = await supabase
    .from("company_profile")
    .update({ seal_url: url })
    .eq("id", id)

  if (updateError) return { error: updateError.message }

  revalidatePath("/settings")
  return { error: null, url }
}

export async function saveSignature(dataUrl: string) {
  const supabase = await createClient()
  const id = await getProfileId(supabase)

  const base64 = dataUrl.split(",")[1]
  if (!base64) return { error: "Invalid signature image" }
  const bytes = Buffer.from(base64, "base64")

  const path = "signature.png"

  const { error: uploadError } = await supabase.storage
    .from("signature")
    .upload(path, bytes, { upsert: true, contentType: "image/png" })

  if (uploadError) return { error: uploadError.message }

  const { data: publicUrlData } = supabase.storage.from("signature").getPublicUrl(path)
  const url = `${publicUrlData.publicUrl}?v=${Date.now()}`

  const { error: updateError } = await supabase
    .from("company_profile")
    .update({ signature_url: url })
    .eq("id", id)

  if (updateError) return { error: updateError.message }

  revalidatePath("/settings")
  return { error: null, url }
}
