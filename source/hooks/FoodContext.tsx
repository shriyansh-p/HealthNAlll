import React, { createContext, useState, ReactNode } from "react";

interface NutritionInfo {
  serving_qty: number;
  serving_unit: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
}

interface FoodItem {
  food_name: string;
  brand_name?: string;
  nutrition: NutritionInfo;
}

interface FoodContextType {
  consumedFoods: FoodItem[];
  addConsumedFood: (food: FoodItem) => void;
  clearConsumedFoods: () => void; // Added useful utility function
}

export const FoodContext = createContext<FoodContextType>({
  consumedFoods: [],
  addConsumedFood: () => {},
  clearConsumedFoods: () => {},
});

export const FoodProvider = ({ children }: { children: ReactNode }) => {
  const [consumedFoods, setConsumedFoods] = useState<FoodItem[]>([]);

  const addConsumedFood = (food: FoodItem) => {
    setConsumedFoods((prev) => [...prev, food]);
  };

  const clearConsumedFoods = () => {
    setConsumedFoods([]);
  };

  return (
    <FoodContext.Provider value={{ consumedFoods, addConsumedFood, clearConsumedFoods }}>
      {children}
    </FoodContext.Provider>
  );
};

// Utility function to convert Nutritionix API response to FoodItem
export const nutritionixToFoodItem = (item: any): FoodItem => ({
  food_name: item.food_name,
  brand_name: item.brand_name || undefined,
  nutrition: {
    serving_qty: item.serving_qty,
    serving_unit: item.serving_unit,
    nf_calories: item.nf_calories,
    nf_protein: item.nf_protein,
    nf_total_carbohydrate: item.nf_total_carbohydrate,
    nf_total_fat: item.nf_total_fat,
  },
});