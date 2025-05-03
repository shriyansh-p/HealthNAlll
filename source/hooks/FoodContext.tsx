import React, { createContext, useState, ReactNode, useEffect } from "react";
import { getData, storeData } from "../../utils/storage";
import { AppState } from "react-native";

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
  clearConsumedFoods: () => void;
}

export const FoodContext = createContext<FoodContextType>({
  consumedFoods: [],
  addConsumedFood: () => {},
  clearConsumedFoods: () => {},
});

export const FoodProvider = ({ children }: { children: ReactNode }) => {
  const [consumedFoods, setConsumedFoods] = useState<FoodItem[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());

  // Initialize and check for day change
  useEffect(() => {
    const initializeFoodData = async () => {
      try {
        const [savedFoods, savedDate] = await Promise.all([
          getData('consumedFoods'),
          getData('foodLogDate')
        ]);

        const today = getTodayDateString();
        setCurrentDate(today);

        if (savedDate !== today) {
          // New day - clear previous data
          setConsumedFoods([]);
          await storeData('consumedFoods', JSON.stringify([]));
          await storeData('foodLogDate', today);
        } else if (savedFoods) {
          // Same day - load existing data
          setConsumedFoods(JSON.parse(savedFoods));
        }
      } catch (error) {
        console.error('Error initializing food data:', error);
      }
    };

    initializeFoodData();
  }, []);

  // Check for day changes when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        const today = getTodayDateString();
        if (today !== currentDate) {
          setCurrentDate(today);
          setConsumedFoods([]);
          storeData('consumedFoods', JSON.stringify([]));
          storeData('foodLogDate', today);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [currentDate]);

  // Save data whenever consumedFoods changes
  useEffect(() => {
    if (consumedFoods.length > 0) {
      storeData('consumedFoods', JSON.stringify(consumedFoods));
      storeData('foodLogDate', currentDate);
    }
  }, [consumedFoods, currentDate]);

  const addConsumedFood = (food: FoodItem) => {
    setConsumedFoods(prev => [...prev, food]);
  };

  const clearConsumedFoods = () => {
    setConsumedFoods([]);
  };

  return (
    <FoodContext.Provider value={{ 
      consumedFoods, 
      addConsumedFood, 
      clearConsumedFoods 
    }}>
      {children}
    </FoodContext.Provider>
  );
};

// Helper function for date tracking
const getTodayDateString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

// OpenFoodFacts API converter (unchanged from your original)
export const openFoodFactsToFoodItem = (item: any): FoodItem => ({
  food_name: item.product.product_name || "Unnamed Food",
  brand_name: item.product.brands || "Generic",
  nutrition: {
    serving_qty: item.product.serving_quantity || 100,
    serving_unit: item.product.serving_size || "g",
    nf_calories: item.product.nutriments["energy-kcal"] || 0,
    nf_protein: item.product.nutriments.proteins || 0,
    nf_total_carbohydrate: item.product.nutriments.carbohydrates || 0,
    nf_total_fat: item.product.nutriments.fat || 0,
  },
});