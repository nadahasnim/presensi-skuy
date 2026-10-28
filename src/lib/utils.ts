import { clsx, type ClassValue } from "clsx"
import type { MouseEvent } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// WIB is a fixed GMT+7 (no DST): shift UTC by 7h and read the ISO parts.
export function nowWIB() {
  const iso = new Date(Date.now() + 7 * 36e5).toISOString()
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) }
}

// Chrome on desktop (incl. DevTools mobile mode) only opens the date/time picker from
// its tiny icon; open it on any tap of the field. Phones already do this natively.
export function openPicker(e: MouseEvent<HTMLInputElement>) {
  try {
    e.currentTarget.showPicker()
  } catch {
    // showPicker unsupported (older Safari) or blocked: keep the browser's default behavior
  }
}
