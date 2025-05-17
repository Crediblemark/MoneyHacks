import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ParsedExpense, Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseExpenseInput(input: string): ParsedExpense | null {
  const cleanedInput = input.toLowerCase().trim();

  // Regex to find amount (e.g., 50rb, 20k, 1jt, 100000)
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

  // Extract description (text before amount)
  let description = cleanedInput.substring(0, amountMatch.index).trim();
  if (description.length === 0) {
    description = "Expense"; // Default description if none is provided
  }
  // Capitalize first letter
  description = description.charAt(0).toUpperCase() + description.slice(1);


  // Detect category
  let category: Category = "Lainnya";
  if (/(makan|food|sarapan|siang|malam|nasi|mie|kopi|teh)/.test(cleanedInput)) {
    category = "Makanan";
  } else if (/(transport|gojek|grab|bensin|parkir|tol|bis|kereta)/.test(cleanedInput)) {
    category = "Transport";
  } else if (/(belanja|shopping|beli|toko|online|pasar)/.test(cleanedInput)) {
    category = "Belanja";
  }

  return { description, amount, category };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export function getMonthName(monthIndex: number): string {
  const date = new Date();
  date.setMonth(monthIndex);
  return date.toLocaleString('id-ID', { month: 'long' });
}
