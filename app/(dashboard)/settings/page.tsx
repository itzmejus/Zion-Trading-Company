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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          These details appear on every bill and quotation you create.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="company">
            <TabsList>
              <TabsTrigger value="company">Company &amp; GST</TabsTrigger>
              <TabsTrigger value="bank">Bank Details</TabsTrigger>
              <TabsTrigger value="seal">Seal &amp; Signature</TabsTrigger>
            </TabsList>
            <TabsContent value="company" className="pt-6">
              <CompanyDetailsForm profile={profile} />
            </TabsContent>
            <TabsContent value="bank" className="pt-6">
              <BankDetailsForm profile={profile} />
            </TabsContent>
            <TabsContent value="seal" className="pt-6">
              <SealSignatureForm profile={profile} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
