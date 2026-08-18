import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database"

/** Indian financial year label for a date, e.g. Aug 2026 -> "2026-27". */
export function financialYearLabel(date = new Date()): string {
  const year = date.getFullYear()
  const isBeforeApril = date.getMonth() < 3 // Jan=0 .. Mar=2
  const startYear = isBeforeApril ? year - 1 : year
  const endYear = (startYear + 1) % 100
  return `${startYear}-${String(endYear).padStart(2, "0")}`
}

/**
 * Atomically reserves the next sequential number for the given document kind
 * and financial year, then formats it as PREFIX/FY/0001.
 */
export async function nextDocumentNumber(
  supabase: SupabaseClient<Database>,
  kind: "invoice" | "quote",
  prefix: string,
  date = new Date()
): Promise<string> {
  const fy = financialYearLabel(date)
  const counterKey = `${kind}-${fy}`

  const { data, error } = await supabase.rpc("next_document_number", {
    counter_key: counterKey,
  })

  if (error) throw error

  const number = data as number
  return `${prefix}/${fy}/${String(number).padStart(4, "0")}`
}
