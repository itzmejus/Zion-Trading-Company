"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Pencil, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createProduct, updateProduct } from "@/lib/actions/products"
import { productSchema, type ProductValues } from "@/lib/validation/product"
import type { Product } from "@/lib/types/database"

function NumberField({
  control,
  name,
  label,
  max,
}: {
  control: ReturnType<typeof useForm<ProductValues>>["control"]
  name: "landing_cost" | "selling_cost" | "sgst_percent" | "cgst_percent" | "stock_qty"
  label: string
  max?: number
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              min="0"
              max={max}
              {...field}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function ProductFormDialog({ product }: { product?: Product }) {
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const isEdit = !!product

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      hsn_code: product?.hsn_code ?? "",
      unit: product?.unit ?? "Nos",
      supplier_name: product?.supplier_name ?? "",
      landing_cost: product?.landing_cost ?? 0,
      selling_cost: product?.selling_cost ?? 0,
      sgst_percent: product?.sgst_percent ?? 9,
      cgst_percent: product?.cgst_percent ?? 9,
      stock_qty: product?.stock_qty ?? 0,
    },
  })

  async function onSubmit(values: ProductValues) {
    setIsSaving(true)
    const result = isEdit
      ? await updateProduct(product.id, values)
      : await createProduct(values)
    setIsSaving(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(isEdit ? "Product updated" : "Product added")
    setOpen(false)
    if (!isEdit) form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon-sm" />
          ) : (
            <Button />
          )
        }
      >
        {isEdit ? (
          <>
            <Pencil className="size-4" />
            <span className="sr-only">Edit product</span>
          </>
        ) : (
          <>
            <Plus className="size-4" />
            Add Product
          </>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "Add product"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hsn_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HSN code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nos / Box / Kg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplier_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Received from" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <NumberField control={form.control} name="landing_cost" label="Landing cost (₹)" />
            <NumberField control={form.control} name="selling_cost" label="Selling cost (₹)" />

            <NumberField control={form.control} name="sgst_percent" label="SGST %" max={100} />
            <NumberField control={form.control} name="cgst_percent" label="CGST %" max={100} />

            <NumberField control={form.control} name="stock_qty" label="Stock qty" />

            <Button type="submit" className="self-end" disabled={isSaving}>
              {isSaving ? "Saving..." : isEdit ? "Save changes" : "Add product"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
