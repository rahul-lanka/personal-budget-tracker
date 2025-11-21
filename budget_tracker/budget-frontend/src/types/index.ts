// src/types/index.ts
export type Category = {
  id: number;
  name: string;
};

export type Transaction = {
  id: number;
  type: "income" | "expense";
  amount: string; // string because DRF returns Decimal as string
  note?: string;
  date: string; // YYYY-MM-DD
  category?: Category | null;
};

export type BudgetCompare = {
  month: string;
  budget: number;
  actual_expenses: number;
  remaining: number;
};
