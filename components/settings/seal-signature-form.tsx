"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SignaturePad } from "@/components/signature/signature-pad"
import { uploadSeal } from "@/lib/actions/settings"
import type { CompanyProfile } from "@/lib/types/database"

export function SealSignatureForm({ profile }: { profile: CompanyProfile }) {
  const [sealUrl, setSealUrl] = useState(profile.seal_url)
  const [signatureUrl, setSignatureUrl] = useState(profile.signature_url)
  const [isUploading, setIsUploading] = useState(false)
  const [signatureOpen, setSignatureOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSealChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.set("file", file)

    setIsUploading(true)
    const result = await uploadSeal(formData)
    setIsUploading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Seal image saved")
    if (result.url) setSealUrl(result.url)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="space-y-3">
        <Label>Company seal</Label>
        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-md border bg-white">
          {sealUrl ? (
            <Image
              src={sealUrl}
              alt="Company seal"
              width={128}
              height={128}
              className="h-full w-full object-contain"
              unoptimized
            />
          ) : (
            <span className="px-2 text-center text-xs text-muted-foreground">
              No seal uploaded
            </span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleSealChange}
          className="hidden"
          id="seal-upload"
        />
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? "Uploading..." : sealUrl ? "Replace seal image" : "Upload seal image"}
        </Button>
      </div>

      <div className="space-y-3">
        <Label>Authorized signature</Label>
        <div className="flex h-32 w-full max-w-xs items-center justify-center overflow-hidden rounded-md border bg-white">
          {signatureUrl ? (
            <Image
              src={signatureUrl}
              alt="Signature"
              width={256}
              height={128}
              className="h-full w-full object-contain"
              unoptimized
            />
          ) : (
            <span className="px-2 text-center text-xs text-muted-foreground">
              No signature saved
            </span>
          )}
        </div>
        <Dialog open={signatureOpen} onOpenChange={setSignatureOpen}>
          <DialogTrigger render={<Button type="button" variant="outline" />}>
            {signatureUrl ? "Redraw signature" : "Draw signature"}
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Draw your signature</DialogTitle>
            </DialogHeader>
            <SignaturePad
              onSaved={(url) => {
                setSignatureUrl(url)
                setSignatureOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
