import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileTopbar } from "@/components/layout/mobile-topbar"
import { getCompanyProfile } from "@/lib/data/company-profile"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCompanyProfile()
  const companyName = profile.company_name || "Zion Trading Company"

  return (
    <div className="flex min-h-screen">
      <AppSidebar companyName={companyName} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar companyName={companyName} />
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
