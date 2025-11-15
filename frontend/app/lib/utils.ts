import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getConditionBadgeColor(condition: string): string {
  const conditionLower = condition?.toLowerCase() || ""
  
  switch (conditionLower) {
    case "new":
      return "bg-green-600 text-white"
    case "like new":
      return "bg-green-500 text-white"
    case "excellent":
      return "bg-blue-600 text-white"
    case "good":
      return "bg-yellow-500 text-white"
    case "fair":
      return "bg-orange-500 text-white"
    case "poor":
      return "bg-red-600 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

export function getStatusBadgeColor(status: string): string {
  const statusLower = status?.toLowerCase() || ""
  
  switch (statusLower) {
    case "available":
    case "active":
      return "bg-green-600 text-white"
    case "sold":
    case "completed":
      return "bg-gray-600 text-white"
    case "pending":
    case "processing":
      return "bg-yellow-600 text-white"
    case "out of stock":
    case "unavailable":
      return "bg-red-600 text-white"
    case "reserved":
      return "bg-blue-600 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj)
}
