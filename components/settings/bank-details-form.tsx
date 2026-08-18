"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
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
  )
}
