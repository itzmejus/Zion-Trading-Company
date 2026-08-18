"use client"

import { useState } from "react"
import { PackageSearch } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Product } from "@/lib/types/database"

export function ProductPickerButton({
  products,
  onSelect,
}: {
  products: Product[]
  onSelect: (product: Product) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="shrink-0 gap-1.5"
            aria-label="Pick an item from stock"
            title="Pick an item from stock"
          />
        }
      >
        <PackageSearch className="size-4" />
        <span className="hidden sm:inline">From stock</span>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <Command>
          <CommandInput placeholder="Search stock by item name..." />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => {
                    onSelect(product)
                    setOpen(false)
                  }}
                >
                  {product.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
