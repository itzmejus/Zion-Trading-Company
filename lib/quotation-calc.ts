import { round2 } from "@/lib/gst"

export interface QuoteLineInput {
  qty: number
  rate: number
  discountPercent: number
}

export function computeQuoteLineTotal({ qty, rate, discountPercent }: QuoteLineInput): number {
  const base = qty * rate
  const discountAmount = base * (discountPercent / 100)
  return round2(base - discountAmount)
}

export function computeQuoteTotals(lines: Array<QuoteLineInput & { total: number }>) {
  const subtotal = round2(lines.reduce((sum, l) => sum + l.qty * l.rate, 0))
  const discountTotal = round2(lines.reduce((sum, l) => sum + (l.qty * l.rate - l.total), 0))
  const grandTotal = round2(lines.reduce((sum, l) => sum + l.total, 0))
  return { subtotal, discountTotal, grandTotal }
}
