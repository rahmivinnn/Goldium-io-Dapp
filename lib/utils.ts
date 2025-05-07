import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number

  return function (this: any, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args)
      lastRan = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan),
      )
    }
  } as T
}

/**
 * Validates if a string is a valid Solana address
 * @param address The address to validate
 * @returns True if the address is valid, false otherwise
 */
export function isValidSolanaAddress(address: string): boolean {
  // Basic validation: Solana addresses are 32-44 characters long and contain only base58 characters
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
  return base58Regex.test(address)
}

/**
 * Formats a number with commas and optional decimal places
 * @param value The number to format
 * @param decimals The number of decimal places to show (default: 2)
 * @returns The formatted number as a string
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0"
  }

  // Handle large numbers
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(decimals)}B`
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals)}M`
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(decimals)}K`
  }

  // For small numbers, show more decimals if needed
  if (value < 0.01 && value > 0) {
    return value.toFixed(6)
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: value % 1 === 0 ? 0 : decimals,
    maximumFractionDigits: decimals,
  })
}
