import type React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Selects the full value of a text/number input on focus so a default like
 * `0` is replaced instead of the new digits being appended to it.
 */
export function selectOnFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.select()
}
