
export const CATEGORIES = ["Makanan", "Transport", "Belanja", "Lainnya"] as const;
export type Category = typeof CATEGORIES[number];

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
}

export interface ParsedExpense {
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
  // status: 'active' | 'completed' | 'failed'; // For future enhancement
}
