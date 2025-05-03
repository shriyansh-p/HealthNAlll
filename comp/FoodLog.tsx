import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { FoodContext } from "../source/hooks/FoodContext";
import { calculateCalorieGoal, calculateMacros, UserData } from "../source/hooks/CalorieCalculator";
import { getData } from "../utils/storage";

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

interface ConsumedFood {
  food_name: string;
  brand_name?: string;
  serving_qty: number;
  serving_unit: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
  frequency?: number;
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const FoodLog = ({ userData }: { userData: UserData }) => {
  const { consumedFoods } = useContext(FoodContext);
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 50,
    carbs: 200,
    fat: 65
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load saved goals and calculate if needed
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const [savedCalories, savedMacros] = await Promise.all([
          getData('calorieGoal'),
          getData('macros')
        ]);

        if (savedCalories && savedMacros) {
          setNutritionGoals({
            calories: Number(savedCalories) || 2000,
            protein: JSON.parse(savedMacros).protein || 50,
            carbs: JSON.parse(savedMacros).carbs || 200,
            fat: JSON.parse(savedMacros).fat || 65
          });
        } else if (userData) {
          const calorieGoal = calculateCalorieGoal(userData);
          const macros = calculateMacros(calorieGoal, userData);
          setNutritionGoals({
            calories: calorieGoal,
            ...macros
          });
        }
      } catch (error) {
        console.error('Error loading nutrition goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGoals();
  }, [userData]);

  // Safely group consumed foods with null checks
  const groupedFoods = consumedFoods.reduce((acc: Record<string, ConsumedFood>, food) => {
    if (!food || !food.nutrition) return acc;
    
    const key = `${food.food_name}-${food.brand_name}-${food.nutrition.serving_qty}${food.nutrition.serving_unit}`;
    if (!acc[key]) {
      acc[key] = { 
        ...food.nutrition,
        food_name: food.food_name,
        brand_name: food.brand_name,
        frequency: 1 
      };
    } else {
      acc[key].frequency! += 1;
    }
    return acc;
  }, {});

  const groupedFoodsArray = Object.values(groupedFoods);

  // Calculate totals with fallback values
  const totalCalories = groupedFoodsArray.reduce((sum, food) => 
    sum + ((food?.nf_calories || 0) * (food?.frequency || 1)), 0);
  
  const totalProtein = groupedFoodsArray.reduce((sum, food) => 
    sum + ((food?.nf_protein || 0) * (food?.frequency || 1)), 0);

  const totalCarbs = groupedFoodsArray.reduce((sum, food) => 
    sum + ((food?.nf_total_carbohydrate || 0) * (food?.frequency || 1)), 0);

  const totalFat = groupedFoodsArray.reduce((sum, food) => 
    sum + ((food?.nf_total_fat || 0) * (food?.frequency || 1)), 0);

  // Calculate percentages of goals with fallbacks
  const caloriePercentage = Math.min(100, Math.round((totalCalories / (nutritionGoals.calories || 2000)) * 100)) || 0;
  const proteinPercentage = Math.min(100, Math.round((totalProtein / (nutritionGoals.protein || 50)) * 100)) || 0;
  const carbsPercentage = Math.min(100, Math.round((totalCarbs / (nutritionGoals.carbs || 200)) * 100)) || 0;
  const fatPercentage = Math.min(100, Math.round((totalFat / (nutritionGoals.fat || 65)) * 100)) || 0;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading your food data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Log</Text>
  
      {groupedFoodsArray.length === 0 ? (
        <Text style={styles.noFoodText}>No food logged yet.</Text>
      ) : (
        <FlatList
          data={groupedFoodsArray}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.food_name || 'Unknown Food'}</Text>
                {item.brand_name && <Text style={styles.foodBrand}>Brand: {item.brand_name}</Text>}
                <Text style={styles.foodServing}>
                  Serving: {item.serving_qty || 1} {item.serving_unit || 'serving'}
                </Text>
                <Text style={styles.foodNutrition}>
                  Calories: {item.nf_calories || 0} cal
                </Text>
                <Text style={styles.foodMacros}>
                  P: {item.nf_protein || 0}g • C: {item.nf_total_carbohydrate || 0}g • F: {item.nf_total_fat || 0}g
                </Text>
              </View>
              <Text style={styles.foodFrequency}>x{item.frequency || 1}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 150 }}
        />
      )}
  
      <View style={styles.totalsContainer}>
        <Text style={styles.totalsTitle}>Daily Nutrition</Text>
  
        <View style={styles.macrosRow}>
          <Text style={styles.macroLabel}>Calories</Text>
          <Text style={styles.macroText}>
            {totalCalories.toFixed(0)} / {nutritionGoals.calories} cal ({caloriePercentage}%)
          </Text>
        </View>
  
        <View style={styles.macrosRow}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroText}>
            {totalProtein.toFixed(0)} / {nutritionGoals.protein} g ({proteinPercentage}%)
          </Text>
        </View>
  
        <View style={styles.macrosRow}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroText}>
            {totalCarbs.toFixed(0)} / {nutritionGoals.carbs} g ({carbsPercentage}%)
          </Text>
        </View>
  
        <View style={styles.macrosRow}>
          <Text style={styles.macroLabel}>Fat</Text>
          <Text style={styles.macroText}>
            {totalFat.toFixed(0)} / {nutritionGoals.fat} g ({fatPercentage}%)
          </Text>
        </View>
      </View>
    </View>
  );
};

// Keep all your existing styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#fff" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 16 
  },
  noFoodText: { 
    fontSize: 16, 
    color: "#888", 
    textAlign: "center", 
    marginTop: 20 
  },
  foodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  foodInfo: { 
    flex: 1 
  },
  foodName: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 4 
  },
  foodBrand: { 
    fontSize: 14, 
    color: "#6c757d", 
    marginBottom: 4 
  },
  foodServing: { 
    fontSize: 14, 
    color: "#6c757d", 
    marginBottom: 4 
  },
  foodNutrition: { 
    fontSize: 14, 
    color: "#212529", 
    marginBottom: 2 
  },
  foodMacros: { 
    fontSize: 14, 
    color: "#495057" 
  },
  foodFrequency: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#0d6efd" 
  },
  totalsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 20,
    padding: 16,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  totalsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#212529",
    textAlign: "center",
  },
  macrosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  macroText: {
    fontSize: 15,
    color: "#495057",
  },
});

export default FoodLog;