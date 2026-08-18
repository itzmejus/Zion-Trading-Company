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
    <div className="mx-auto w-full max-w-[210mm] bg-white p-6 text-black shadow-sm print:shadow-none sm:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/20 pb-4">
        <div>
          <h1 className="text-xl font-bold">{companyProfile.company_name}</h1>
          <p className="max-w-xs text-sm text-black/70">
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
          <h2 className="text-lg font-semibold tracking-wide">QUOTATION</h2>
          <p className="text-sm">
            <span className="text-black/60">Quote No: </span>
            <span className="font-medium">{quotation.quote_number}</span>
          </p>
          <p className="text-sm">
            <span className="text-black/60">Date: </span>
            {formatDate(quotation.quote_date)}
          </p>
        </div>
      </div>

      <div className="mt-4 border-b border-black/20 pb-4">
        <p className="text-xs font-semibold tracking-wide text-black/60 uppercase">Quote for</p>
        <p className="font-medium">{quotation.customer.name}</p>
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
          <tr className="border-b border-black/40 text-left">
            <th className="py-1.5 pr-2">#</th>
            <th className="py-1.5 pr-2">Item</th>
            <th className="py-1.5 pr-2 text-right">Qty</th>
            <th className="py-1.5 pr-2 text-right">Rate</th>
            <th className="py-1.5 pr-2 text-right">Disc %</th>
            <th className="py-1.5 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {quotation.items.map((item, index) => (
            <tr key={item.id} className="border-b border-black/10">
              <td className="py-1.5 pr-2 align-top">{index + 1}</td>
              <td className="py-1.5 pr-2 align-top">{item.item_name}</td>
              <td className="py-1.5 pr-2 text-right align-top">{item.qty}</td>
              <td className="py-1.5 pr-2 text-right align-top">{formatCurrency(item.rate)}</td>
              <td className="py-1.5 pr-2 text-right align-top">{item.discount_percent}%</td>
              <td className="py-1.5 text-right align-top font-medium">{formatCurrency(item.total_amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <div className="w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-black/60">Subtotal</span>
            <span>{formatCurrency(quotation.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black/60">Discount</span>
            <span>- {formatCurrency(quotation.discount_total)}</span>
          </div>
          <div className="flex justify-between border-t border-black/30 pt-1 text-base font-semibold">
            <span>Grand Total</span>
            <span>{formatCurrency(quotation.grand_total)}</span>
          </div>
        </div>
      </div>

      {quotation.notes && (
        <div className="mt-4 text-sm">
          <p className="font-semibold text-black/60">Notes</p>
          <p className="whitespace-pre-wrap text-black/80">{quotation.notes}</p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-end justify-end gap-6 border-t border-black/20 pt-4">
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
