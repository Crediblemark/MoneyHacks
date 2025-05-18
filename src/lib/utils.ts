
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ParsedExpenseInfo, ParsedIncome, Category } from '@/lib/types'; // Category is now string
import { DEFAULT_CATEGORIES } from '@/lib/types';
import type { Language } from "./translations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// parseExpenseInput now only focuses on description and amount. Category is handled by AI.
export function parseExpenseInput(input: string): ParsedExpenseInfo | null {
  const cleanedInput = input.toLowerCase().trim();

  // Regex to find amount, potentially anywhere in the string.
  // It looks for a number, optionally followed by spaces, then (rb, k, jt).
  // Or just a number if no suffix.
  const amountRegex = /(\d+)\s*(rb|k|jt)?/i;
  const amountMatch = cleanedInput.match(amountRegex);

  if (!amountMatch || !amountMatch[1]) { // Ensure group 1 (the number) exists
    return null;
  }

  let amount = parseInt(amountMatch[1], 10);
  const multiplier = amountMatch[2]; // Suffix like 'rb', 'k', 'jt'

  if (multiplier) {
    if (multiplier === 'rb' || multiplier === 'k') {
      amount *= 1000;
    } else if (multiplier === 'jt') {
      amount *= 1000000;
    }
  }

  // Extract description by removing the amount part.
  // This is a bit naive and might need improvement if amounts can appear multiple times or formats are very complex.
  let description = cleanedInput.replace(amountMatch[0], '').trim();
  
  // If description becomes empty after removing amount, try taking text before amountMatch.index
  if (!description && amountMatch.index > 0) {
    description = cleanedInput.substring(0, amountMatch.index).trim();
  }
  
  // Fallback description if still empty
  if (!description) {
    description = "Pengeluaran"; // Default to "Expense" or "Pengeluaran"
    if (input.toLowerCase().includes("makan") || input.toLowerCase().includes("food")) {
        description = "Makanan";
    } else if (input.toLowerCase().includes("transport") || input.toLowerCase().includes("gojek") || input.toLowerCase().includes("grab")) {
        description = "Transportasi";
    }
  }
  
  description = description.charAt(0).toUpperCase() + description.slice(1);


  return { description, amount };
}

export function parseIncomeInput(input: string): ParsedIncome | null {
  const cleanedInput = input.toLowerCase().trim();
  const amountRegex = /(\d+)\s*(rb|k|jt)?/i;
  const amountMatch = cleanedInput.match(amountRegex);

  if (!amountMatch) {
    return null;
  }

  let amount = parseInt(amountMatch[1], 10);
  const multiplier = amountMatch[2];

  if (multiplier === 'rb' || multiplier === 'k') {
    amount *= 1000;
  } else if (multiplier === 'jt') {
    amount *= 1000000;
  }

  let description = cleanedInput.substring(0, amountMatch.index).trim();
  
  if (description.length === 0) {
    description = cleanedInput.substring(amountMatch.index + amountMatch[0].length).trim();
  }

  if (description.length === 0) {
    description = "Pemasukan"; 
  }
  description = description.charAt(0).toUpperCase() + description.slice(1);

  return { description, amount };
}


export function formatCurrency(amount: number, lang: Language = 'id'): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export function getMonthName(monthIndex: number, lang: Language = 'id'): string {
  const date = new Date();
  date.setMonth(monthIndex);
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  return date.toLocaleString(locale, { month: 'long' });
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'default'; // Or 'denied' if preferred for SSR/unsupported environments
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  if (Notification.permission === 'denied') {
    return 'denied';
  }
  return Notification.requestPermission();
}

export function showBrowserNotification(title: string, body?: string, icon?: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Browser notifications not supported.');
    return;
  }

  if (Notification.permission === 'granted') {
    const options: NotificationOptions = {
      body: body,
      icon: icon || '/icons/icon-192x192.png', // Default icon
    };
    new Notification(title, options);
  } else if (Notification.permission === 'default') {
    console.log('Notification permission not yet granted or denied.');
    // Optionally, prompt the user to grant permission here
    // requestNotificationPermission(); // Be careful about calling this without user interaction
  } else {
    console.log('Notification permission denied.');
  }
}
