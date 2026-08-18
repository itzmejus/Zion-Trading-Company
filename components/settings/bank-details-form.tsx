"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Landmark } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { updateCompanyProfile } from "@/lib/actions/settings"
import type { CompanyProfile } from "@/lib/types/database"

const schema = z.object({
  bank_name: z.string().optional(),
  account_holder: z.string().optional(),
  account_number: z.string().optional(),
  ifsc: z.string().optional(),
  branch: z.string().optional(),
})

type Values = z.infer<typeof schema>

export function BankDetailsForm({ profile }: { profile: CompanyProfile }) {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      bank_name: profile.bank_name,
      account_holder: profile.account_holder,
      account_number: profile.account_number,
      ifsc: profile.ifsc,
      branch: profile.branch,
    },
  })

  async function onSubmit(values: Values) {
    setIsSaving(true)
    const result = await updateCompanyProfile(values)
    setIsSaving(false)

    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Bank details saved")
  }

  const preview = form.watch()
  const hasAnyDetail = Object.values(preview).some((v) => v && v.trim())

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="bank_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account_holder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account holder name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ifsc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" size="lg" disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? "Saving..." : "Save bank details"}
          </Button>
        </form>
      </Form>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Preview on invoice</p>
        <div className="rounded-lg border bg-muted/30 p-4">
          {hasAnyDetail ? (
            <div className="space-y-0.5 text-sm">
              <p className="mb-1.5 flex items-center gap-1.5 font-semibold text-foreground">
                <Landmark className="size-3.5" />
                Bank Details
              </p>
              {preview.bank_name && <p>Bank: {preview.bank_name}</p>}
              {preview.account_holder && <p>Account holder: {preview.account_holder}</p>}
              {preview.account_number && <p>Account no: {preview.account_number}</p>}
              {preview.ifsc && <p>IFSC: {preview.ifsc}</p>}
              {preview.branch && <p>Branch: {preview.branch}</p>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Fill in the fields to see how this will look on your invoices.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
