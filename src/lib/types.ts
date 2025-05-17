
export const DEFAULT_CATEGORIES = ["Makanan", "Transport", "Belanja", "Lainnya"] as const;
export type DefaultCategory = typeof DEFAULT_CATEGORIES[number];
export type Category = string; // Now a string to allow dynamic categories

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category; // Changed to string
  date: string; // YYYY-MM-DD
}

export interface ParsedExpenseInfo { // Renamed to avoid conflict if ParsedExpense is kept for form <-> context
  description: string;
  amount: number;
}

export interface ParsedExpenseForContext { // Type for what ExpenseForm sends to ExpenseContext
    description: string;
    amount: number;
    category: Category;
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

export interface UserGoalInput {
  name: string;
  description?: string;
  targetAmount: number;
}

export interface Goal extends UserGoalInput {
  id: string;
  currentAmount: number;
  createdAt: string; // ISO date string
  imageUrl?: string;
  imagePrompt?: string; // Store the prompt used for generating the image
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  createdAt: number; // Timestamp
  expiresAt: number; // Timestamp
}
