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
    <div className="flex h-dvh overflow-hidden">
      <AppSidebar companyName={companyName} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <MobileTopbar companyName={companyName} />
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
