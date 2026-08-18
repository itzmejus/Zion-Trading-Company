import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Package,
  Building2,
  FileText,
  FileSpreadsheet,
  Settings,
} from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Bills", icon: FileText },
  { href: "/quotations", label: "Quotations", icon: FileSpreadsheet },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/settings", label: "Settings", icon: Settings },
]
