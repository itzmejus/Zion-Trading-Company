import { formatCurrency, formatDate } from "@/lib/format"
import type { CompanyProfile } from "@/lib/types/database"
import type { QuotationWithDetails } from "@/lib/data/quotations"

export function QuotationPrintTemplate({
  quotation,
  companyProfile,
}: {
  quotation: QuotationWithDetails
  companyProfile: CompanyProfile
}) {
  return (
    <div className="mx-auto w-full max-w-[210mm] bg-white p-6 text-black shadow-sm sm:p-10 print:m-0 print:w-full print:max-w-none print:p-0 print:shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{companyProfile.company_name}</h1>
          <p className="mt-1 max-w-xs text-sm text-black/70">
            {[companyProfile.address, companyProfile.city, companyProfile.state, companyProfile.pincode]
              .filter(Boolean)
              .join(", ")}
          </p>
          {companyProfile.gstin && (
            <p className="text-sm text-black/70">GSTIN: {companyProfile.gstin}</p>
          )}
          {(companyProfile.phone || companyProfile.email) && (
            <p className="text-sm text-black/70">
              {[companyProfile.phone, companyProfile.email].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="inline-block rounded border-2 border-black px-3 py-1 text-sm font-bold tracking-widest text-black uppercase">
            Quotation
          </span>
          <p className="mt-2 text-sm">
            <span className="text-black/60">Quote No: </span>
            <span className="font-medium">{quotation.quote_number}</span>
          </p>
          <p className="text-sm">
            <span className="text-black/60">Date: </span>
            {formatDate(quotation.quote_date)}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md bg-slate-50 p-3">
        <p className="text-xs font-semibold tracking-wide text-black/50 uppercase">Quote for</p>
        <p className="font-semibold">{quotation.customer.name}</p>
        {quotation.customer.contact_person && (
          <p className="text-sm text-black/70">Attn: {quotation.customer.contact_person}</p>
        )}
        <p className="text-sm text-black/70">
          {[quotation.customer.address, quotation.customer.city, quotation.customer.state, quotation.customer.pincode]
            .filter(Boolean)
            .join(", ")}
        </p>
        {quotation.customer.gstin && (
          <p className="text-sm text-black/70">GSTIN: {quotation.customer.gstin}</p>
        )}
      </div>

      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-black text-left">
            <th className="py-2 pr-2 pl-2 font-semibold">#</th>
            <th className="py-2 pr-2 font-semibold">Item</th>
            <th className="py-2 pr-2 text-right font-semibold">Qty</th>
            <th className="py-2 pr-2 text-right font-semibold">Rate</th>
            <th className="py-2 pr-2 text-right font-semibold">Disc %</th>
            <th className="py-2 pr-2 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {quotation.items.map((item, index) => (
            <tr key={item.id} className="border-b border-black/10 even:bg-slate-50">
              <td className="py-1.5 pr-2 pl-2 align-top">{index + 1}</td>
              <td className="py-1.5 pr-2 align-top">{item.item_name}</td>
              <td className="py-1.5 pr-2 text-right align-top tabular-nums">{item.qty}</td>
              <td className="py-1.5 pr-2 text-right align-top tabular-nums">{formatCurrency(item.rate)}</td>
              <td className="py-1.5 pr-2 text-right align-top tabular-nums">{item.discount_percent}%</td>
              <td className="py-1.5 pr-2 text-right align-top font-medium tabular-nums">
                {formatCurrency(item.total_amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end break-inside-avoid">
        <div className="w-full max-w-xs space-y-1.5 rounded-md border border-black/10 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-black/60">Subtotal</span>
            <span className="tabular-nums">{formatCurrency(quotation.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black/60">Discount</span>
            <span className="tabular-nums">- {formatCurrency(quotation.discount_total)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-black px-2 py-1.5 text-base font-bold">
            <span>Grand Total</span>
            <span className="tabular-nums">{formatCurrency(quotation.grand_total)}</span>
          </div>
        </div>
      </div>

      {quotation.notes && (
        <div className="mt-4 text-sm break-inside-avoid">
          <p className="font-semibold text-black/60">Notes</p>
          <p className="whitespace-pre-wrap text-black/80">{quotation.notes}</p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-end justify-end gap-6 border-t border-black/20 pt-4 break-inside-avoid">
        <div className="flex flex-col items-center gap-1 text-center text-sm">
          <div className="flex h-20 items-center gap-2">
            {companyProfile.seal_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={companyProfile.seal_url} alt="Seal" className="h-20 w-20 object-contain" />
            )}
            {companyProfile.signature_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={companyProfile.signature_url}
                alt="Authorized signature"
                className="h-16 w-32 object-contain"
              />
            )}
          </div>
          <p className="text-black/70">For {companyProfile.company_name}</p>
          <p className="text-xs text-black/50">Authorized Signatory</p>
        </div>
      </div>
    </div>
  )
}
