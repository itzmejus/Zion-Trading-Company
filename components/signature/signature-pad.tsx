"use client"

import { useRef, useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { saveSignature } from "@/lib/actions/settings"

export function SignaturePad({ onSaved }: { onSaved?: (url: string) => void }) {
  const padRef = useRef<SignatureCanvas>(null)
  const [isSaving, setIsSaving] = useState(false)

  function handleClear() {
    padRef.current?.clear()
  }

  async function handleSave() {
    const pad = padRef.current
    if (!pad || pad.isEmpty()) {
      toast.error("Draw your signature before saving")
      return
    }

    setIsSaving(true)
    const dataUrl = pad.getTrimmedCanvas().toDataURL("image/png")
    const result = await saveSignature(dataUrl)
    setIsSaving(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success("Signature saved")
    if (result.url) onSaved?.(result.url)
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-md border bg-white">
        <SignatureCanvas
          ref={padRef}
          penColor="#111827"
          canvasProps={{ className: "h-40 w-full touch-none" }}
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save signature"}
        </Button>
      </div>
    </div>
  )
}
