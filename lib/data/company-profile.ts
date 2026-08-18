import { createClient } from "@/lib/supabase/server"
import type { CompanyProfile } from "@/lib/types/database"

/** There is always exactly one row (seeded by the init migration). */
export async function getCompanyProfile(): Promise<CompanyProfile> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("company_profile")
    .select("*")
    .limit(1)
    .single()

  if (error) throw error
  return data
}
