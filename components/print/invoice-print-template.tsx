import { formatCurrency, formatDate } from "@/lib/format"
import type { CompanyProfile } from "@/lib/types/database"
import type { InvoiceWithDetails } from "@/lib/data/invoices"

export function InvoicePrintTemplate({
  invoice,
  companyProfile,
}: {
  invoice: InvoiceWithDetails
  companyProfile: CompanyProfile
}) {
  const sameState = invoice.cgst_total > 0 || invoice.sgst_total > 0

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
            Tax Invoice
          </span>
          <p className="mt-2 text-sm">
            <span className="text-black/60">Bill No: </span>
            <span className="font-medium">{invoice.invoice_number}</span>
          </p>
          <p className="text-sm">
            <span className="text-black/60">Date: </span>
            {formatDate(invoice.invoice_date)}
          </p>
          <p className="text-sm capitalize">
            <span className="text-black/60">Type: </span>
            {invoice.bill_type}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md bg-slate-50 p-3">
        <p className="text-xs font-semibold tracking-wide text-black/50 uppercase">Bill to</p>
        <p className="font-semibold">{invoice.customer.name}</p>
        {invoice.customer.contact_person && (
          <p className="text-sm text-black/70">Attn: {invoice.customer.contact_person}</p>
        )}
        <p className="text-sm text-black/70">
          {[invoice.customer.address, invoice.customer.city, invoice.customer.state, invoice.customer.pincode]
            .filter(Boolean)
            .join(", ")}
        </p>
        {invoice.customer.gstin && (
          <p className="text-sm text-black/70">GSTIN: {invoice.customer.gstin}</p>
        )}
      </div>

      <table className="mt-4 w-full table-fixed border-collapse text-[11px] leading-tight">
        <colgroup>
          <col className="w-[3%]" />
          <col className={sameState ? "w-[22%]" : "w-[31%]"} />
          <col className="w-[8%]" />
          <col className="w-[7%]" />
          <col className="w-[9%]" />
          <col className="w-[7%]" />
          <col className="w-[9%]" />
          <col className="w-[7%]" />
          <col className="w-[9%]" />
          {sameState && <col className="w-[9%]" />}
          <col className="w-[10%]" />
        </colgroup>
        <thead>
          <tr className="border-b-2 border-black text-left">
            <th className="py-2 pr-1 pl-1 font-semibold whitespace-nowrap">#</th>
            <th className="py-2 pr-1 font-semibold whitespace-nowrap">Item</th>
            <th className="py-2 pr-1 font-semibold whitespace-nowrap">HSN</th>
            <th className="py-2 pr-1 text-right font-semibold whitespace-nowrap">Qty</th>
            <th className="py-2 pr-1 text-right font-semibold whitespace-nowrap">Rate</th>
            <th className="py-2 pr-1 text-right font-semibold whitespace-nowrap">Disc %</th>
            <th className="py-2 pr-1 text-right font-semibold whitespace-nowrap">Gross</th>
            <th className="py-2 pr-1 text-right font-semibold whitespace-nowrap">GST %</th>
            {sameState ? (
              <>
                <th className="py-2 pr-1 text-right font-semibold whitespace-nowrap">CGST</th>
                <th className="py-2 pr-1 text-right font-semibold whitespace-nowrap">SGST</th>
              </>
            ) : (
              <th className="py-2 pr-1 text-right font-semibold whitespace-nowrap">IGST</th>
            )}
            <th className="py-2 pr-1 text-right font-semibold whitespace-nowrap">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={item.id} className="border-b border-black/10 even:bg-slate-50">
              <td className="py-1.5 pr-1 pl-1 align-top">{index + 1}</td>
              <td className="py-1.5 pr-1 align-top break-words">{item.item_name}</td>
              <td className="py-1.5 pr-1 align-top whitespace-nowrap">{item.hsn_code || "—"}</td>
              <td className="py-1.5 pr-1 text-right align-top whitespace-nowrap tabular-nums">{item.qty}</td>
              <td className="py-1.5 pr-1 text-right align-top whitespace-nowrap tabular-nums">
                {formatCurrency(item.rate)}
              </td>
              <td className="py-1.5 pr-1 text-right align-top whitespace-nowrap tabular-nums">
                {item.discount_percent}%
              </td>
              <td className="py-1.5 pr-1 text-right align-top whitespace-nowrap tabular-nums">
                {formatCurrency(item.gross_amount)}
              </td>
              <td className="py-1.5 pr-1 text-right align-top whitespace-nowrap tabular-nums">
                {item.sgst_percent + item.cgst_percent}%
              </td>
              {sameState ? (
                <>
                  <td className="py-1.5 pr-1 text-right align-top whitespace-nowrap tabular-nums">
                    {formatCurrency(item.cgst_amount)}
                  </td>
                  <td className="py-1.5 pr-1 text-right align-top whitespace-nowrap tabular-nums">
                    {formatCurrency(item.sgst_amount)}
                  </td>
                </>
              ) : (
                <td className="py-1.5 pr-1 text-right align-top whitespace-nowrap tabular-nums">
                  {formatCurrency(item.igst_amount)}
                </td>
              )}
              <td className="py-1.5 pr-1 text-right align-top font-medium whitespace-nowrap tabular-nums">
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
            <span className="tabular-nums">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black/60">Discount</span>
            <span className="tabular-nums">- {formatCurrency(invoice.discount_total)}</span>
          </div>
          {sameState ? (
            <>
              <div className="flex justify-between">
                <span className="text-black/60">CGST</span>
                <span className="tabular-nums">{formatCurrency(invoice.cgst_total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">SGST</span>
                <span className="tabular-nums">{formatCurrency(invoice.sgst_total)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-black/60">IGST</span>
              <span className="tabular-nums">{formatCurrency(invoice.igst_total)}</span>
            </div>
          )}
          <div className="flex justify-between border-t-2 border-black px-2 py-1.5 text-base font-bold">
            <span>Grand Total</span>
            <span className="tabular-nums">{formatCurrency(invoice.grand_total)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-4 text-sm break-inside-avoid">
          <p className="font-semibold text-black/60">Notes</p>
          <p className="whitespace-pre-wrap text-black/80">{invoice.notes}</p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-black/20 pt-4 break-inside-avoid">
        <div className="text-sm">
          <p className="font-semibold text-black/60">Bank Details</p>
          {companyProfile.bank_name && <p>Bank: {companyProfile.bank_name}</p>}
          {companyProfile.account_holder && <p>Account holder: {companyProfile.account_holder}</p>}
          {companyProfile.account_number && <p>Account no: {companyProfile.account_number}</p>}
          {companyProfile.ifsc && <p>IFSC: {companyProfile.ifsc}</p>}
          {companyProfile.branch && <p>Branch: {companyProfile.branch}</p>}
        </div>
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
