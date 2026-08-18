import { NavLinks } from "@/components/layout/nav-links"
import { LogoutButton } from "@/components/layout/logout-button"

export function AppSidebar({ companyName }: { companyName: string }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <span className="truncate text-base font-semibold text-sidebar-foreground">
          {companyName}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavLinks />
      </div>
      <div className="border-t border-sidebar-border p-3">
        <LogoutButton />
      </div>
    </aside>
  )
}
