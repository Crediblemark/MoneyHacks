
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ParsedExpense, Category, ParsedIncome } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import type { Language } from "./translations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// The parsing logic remains based on Indonesian-style input for amounts (rb, k, jt)
// and keywords for categories, as the primary input method is "chat-like" and might be mixed.
// The UI examples will be translated, but the core parser is kept broad.
export function parseExpenseInput(input: string): ParsedExpense | null {
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
    description = "Expense"; 
  }
  description = description.charAt(0).toUpperCase() + description.slice(1);

  let category: Category = "Lainnya";
  if (/(makan|food|sarapan|siang|malam|nasi|mie|kopi|teh|lunch|dinner|breakfast|coffee|tea)/.test(cleanedInput)) {
    category = "Makanan";
  } else if (/(transport|gojek|grab|bensin|parkir|tol|bis|kereta|gas|parking|bus|train|taxi)/.test(cleanedInput)) {
    category = "Transport";
  } else if (/(belanja|shopping|beli|toko|online|pasar|buy|store|market)/.test(cleanedInput)) {
    category = "Belanja";
  }

  return { description, amount, category };
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

  // Try to extract description before the amount
  let description = cleanedInput.substring(0, amountMatch.index).trim();
  
  // If no description before amount, check after
  if (description.length === 0) {
    description = cleanedInput.substring(amountMatch.index + amountMatch[0].length).trim();
  }

  // Default description if still none
  if (description.length === 0) {
    description = "Pemasukan"; // Default description "Income"
  }
  description = description.charAt(0).toUpperCase() + description.slice(1);

  return { description, amount };
}


export function formatCurrency(amount: number, lang: Language = 'id'): string {
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  // For English, we might not want to show IDR symbol if it's not the context.
  // However, since the app is about Indonesian expenses, IDR is always relevant.
  // Using 'id-ID' for formatting for both, but could be changed if needed.
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export function getMonthName(monthIndex: number, lang: Language = 'id'): string {
  const date = new Date();
  date.setMonth(monthIndex);
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  return date.toLocaleString(locale, { month: 'long' });
}
