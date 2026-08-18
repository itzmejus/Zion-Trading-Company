import Link from "next/link"
import { Building2, FileSpreadsheet, FileText, Package, TriangleAlert } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDashboardStats } from "@/lib/data/dashboard"
import { formatCurrency, formatDate } from "@/lib/format"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      label: "Bills this month",
      value: stats.invoiceCountThisMonth,
      sub: formatCurrency(stats.revenueThisMonth),
      icon: FileText,
    },
    {
      label: "Outstanding credit",
      value: formatCurrency(stats.outstandingCredit),
      sub: "Across all credit bills",
      icon: FileSpreadsheet,
    },
    {
      label: "Companies",
      value: stats.customerCount,
      sub: "Total customers",
      icon: Building2,
    },
    {
      label: "Products",
      value: stats.productCount,
      sub: "In stock catalog",
      icon: Package,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your bills, quotations and stock.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-start justify-between gap-2 pt-6">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </div>
              <stat.icon className="size-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent bills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentInvoices.length === 0 && (
              <p className="text-sm text-muted-foreground">No bills yet.</p>
            )}
            {stats.recentInvoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/invoices/${invoice.id}`}
                className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{invoice.invoice_number}</p>
                  <p className="text-muted-foreground">
                    {invoice.customer_name} · {formatDate(invoice.invoice_date)}
                  </p>
                </div>
                <span className="font-medium">{formatCurrency(invoice.grand_total)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TriangleAlert className="size-4 text-amber-500" />
              Low stock
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.lowStockProducts.length === 0 && (
              <p className="text-sm text-muted-foreground">All products are well stocked.</p>
            )}
            {stats.lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-md border p-3 text-sm"
              >
                <span>{product.name}</span>
                <Badge variant={product.stock_qty === 0 ? "destructive" : "outline"}>
                  {product.stock_qty} {product.unit} left
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
