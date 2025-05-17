
export constCATEGORIES = ["Makanan", "Transport", "Belanja", "Lainnya"] as const;
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
