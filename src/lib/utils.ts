import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type DebounceFn = (...args: any[]) => void

export const debounce = (func: DebounceFn, wait: number): DebounceFn => {
  let timeout: NodeJS.Timeout | null

  return function executedFunction(...args: any[]): void {
    const later = () => {
      if (timeout) {
        clearTimeout(timeout)
        func(...args)
      }
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
