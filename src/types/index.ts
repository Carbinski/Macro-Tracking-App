export interface MacroData {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export interface FoodItem {
  id: string;
  name: string;
  servingSize: number;
  servingUnit: string;
  macros: MacroData;
}

export interface ConsumedItem extends FoodItem {
  consumedAmount: number; // e.g., 1.5 servings or 150g
}

export interface DailyLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  items: ConsumedItem[];
  totalMacros: MacroData;
}
