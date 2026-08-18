"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NavLinks } from "@/components/layout/nav-links"
import { LogoutButton } from "@/components/layout/logout-button"

export function MobileTopbar({ companyName }: { companyName: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-sidebar p-0 text-sidebar-foreground">
          <SheetHeader className="h-16 justify-center border-b border-sidebar-border px-5">
            <SheetTitle className="truncate text-base text-sidebar-foreground">
              {companyName}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
          <div className="border-t border-sidebar-border p-3">
            <LogoutButton />
          </div>
        </SheetContent>
      </Sheet>
      <span className="truncate font-semibold">{companyName}</span>
    </header>
  )
}
