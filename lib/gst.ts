export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export interface LineItemInput {
  qty: number
  rate: number
  discountPercent: number
  sgstPercent: number
  cgstPercent: number
}

export interface LineItemComputed {
  gross: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
  total: number
}

/**
 * Computes a bill line's taxable value and GST split.
 * `sameState` decides CGST+SGST (intra-state) vs IGST (inter-state, using the
 * combined SGST%+CGST% rate) — matching how Indian GST invoices split tax
 * based on supplier vs buyer state.
 */
export function computeLineItem(
  { qty, rate, discountPercent, sgstPercent, cgstPercent }: LineItemInput,
  sameState: boolean
): LineItemComputed {
  const base = qty * rate
  const discountAmount = base * (discountPercent / 100)
  const gross = round2(base - discountAmount)

  if (sameState) {
    const cgstAmount = round2(gross * (cgstPercent / 100))
    const sgstAmount = round2(gross * (sgstPercent / 100))
    return {
      gross,
      cgstAmount,
      sgstAmount,
      igstAmount: 0,
      total: round2(gross + cgstAmount + sgstAmount),
    }
  }

  const igstAmount = round2(gross * ((sgstPercent + cgstPercent) / 100))
  return {
    gross,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount,
    total: round2(gross + igstAmount),
  }
}

export interface DocumentTotals {
  subtotal: number
  discountTotal: number
  cgstTotal: number
  sgstTotal: number
  igstTotal: number
  grandTotal: number
}

export function computeDocumentTotals(
  lines: Array<LineItemInput & LineItemComputed>
): DocumentTotals {
  const subtotal = round2(lines.reduce((sum, l) => sum + l.qty * l.rate, 0))
  const discountTotal = round2(
    lines.reduce((sum, l) => sum + (l.qty * l.rate - l.gross), 0)
  )
  const cgstTotal = round2(lines.reduce((sum, l) => sum + l.cgstAmount, 0))
  const sgstTotal = round2(lines.reduce((sum, l) => sum + l.sgstAmount, 0))
  const igstTotal = round2(lines.reduce((sum, l) => sum + l.igstAmount, 0))
  const grandTotal = round2(lines.reduce((sum, l) => sum + l.total, 0))

  return { subtotal, discountTotal, cgstTotal, sgstTotal, igstTotal, grandTotal }
}
