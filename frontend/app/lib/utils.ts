import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(price);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getConditionBadgeColor(condition: string): string {
  const conditionLower = condition?.toLowerCase() || "";

  switch (conditionLower) {
    case "new":
      return "bg-green-600 text-white";
    case "like new":
      return "bg-green-500 text-white";
    case "excellent":
      return "bg-blue-600 text-white";
    case "good":
      return "bg-yellow-500 text-white";
    case "fair":
      return "bg-orange-500 text-white";
    case "poor":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

export function getStatusBadgeColor(status: string): string {
  const statusLower = status?.toLowerCase() || "";

  switch (statusLower) {
    case "available":
    case "active":
      return "bg-green-600 text-white";
    case "sold":
    case "completed":
      return "bg-gray-600 text-white";
    case "pending":
    case "processing":
      return "bg-yellow-600 text-white";
    case "out of stock":
    case "unavailable":
      return "bg-red-600 text-white";
    case "reserved":
      return "bg-blue-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);
}

export function getTimeRemaining(endTime: string | Date): {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date().getTime();
  const end =
    typeof endTime === "string"
      ? new Date(endTime).getTime()
      : (endTime as Date).getTime();
  const total = Math.max(0, end - now);

  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / 1000 / 60) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}
