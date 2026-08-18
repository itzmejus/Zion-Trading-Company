import { Building2, Landmark, PenTool, Settings as SettingsIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanyDetailsForm } from "@/components/settings/company-details-form"
import { BankDetailsForm } from "@/components/settings/bank-details-form"
import { SealSignatureForm } from "@/components/settings/seal-signature-form"
import { getCompanyProfile } from "@/lib/data/company-profile"

export default async function SettingsPage() {
  const profile = await getCompanyProfile()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <SettingsIcon className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-base text-muted-foreground">
            These details appear on every bill and quotation you create.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="company">
            <TabsList variant="line" className="w-full justify-start gap-1 border-b sm:gap-2">
              <TabsTrigger value="company" className="gap-1.5 py-2.5">
                <Building2 className="size-4" />
                <span className="hidden sm:inline">Company &amp; GST</span>
                <span className="sm:hidden">Company</span>
              </TabsTrigger>
              <TabsTrigger value="bank" className="gap-1.5 py-2.5">
                <Landmark className="size-4" />
                Bank
              </TabsTrigger>
              <TabsTrigger value="seal" className="gap-1.5 py-2.5">
                <PenTool className="size-4" />
                <span className="hidden sm:inline">Seal &amp; Signature</span>
                <span className="sm:hidden">Seal</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="company" className="pt-6">
              <div className="mb-5 space-y-1">
                <h2 className="text-lg font-semibold">Company &amp; GST details</h2>
                <p className="text-sm text-muted-foreground">
                  Your business identity, address, and document numbering prefixes.
                </p>
              </div>
              <CompanyDetailsForm profile={profile} />
            </TabsContent>
            <TabsContent value="bank" className="pt-6">
              <div className="mb-5 space-y-1">
                <h2 className="text-lg font-semibold">Bank details</h2>
                <p className="text-sm text-muted-foreground">
                  Shown on every tax invoice so customers know where to pay.
                </p>
              </div>
              <BankDetailsForm profile={profile} />
            </TabsContent>
            <TabsContent value="seal" className="pt-6">
              <div className="mb-5 space-y-1">
                <h2 className="text-lg font-semibold">Seal &amp; signature</h2>
                <p className="text-sm text-muted-foreground">
                  Appears above &quot;Authorized Signatory&quot; on printed bills and quotations.
                </p>
              </div>
              <SealSignatureForm profile={profile} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
