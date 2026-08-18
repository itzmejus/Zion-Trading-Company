import Link from "next/link"
import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"

export function LinkButton({
  href,
  target,
  children,
  ...props
}: Omit<ComponentProps<typeof Button>, "render"> & {
  href: string
  target?: string
}) {
  return (
    <Button {...props} nativeButton={false} render={<Link href={href} target={target} />}>
      {children}
    </Button>
  )
}
