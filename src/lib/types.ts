
export const CATEGORIES = ["Makanan", "Transport", "Belanja", "Lainnya"] as const;
export type Category = typeof CATEGORIES[number];

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  isPrivate?: boolean; // Added for private entries
}

export interface ParsedExpense {
  description: string;
  amount: number;
  category: Category;
  isPrivate?: boolean; // Added for private entries
}

export interface Income {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
}

export interface ParsedIncome {
  description: string;
  amount: number;
}
