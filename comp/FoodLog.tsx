import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { FoodContext } from "../source/hooks/FoodContext";
import { calculateCalorieGoal, calculateMacros, UserData } from "../source/hooks/CalorieCalculator";

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
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  // Calculate nutrition goals when userData changes
  useEffect(() => {
    if (userData) {
      const calorieGoal = calculateCalorieGoal(userData);
      const macros = calculateMacros(calorieGoal, userData);

      
      setNutritionGoals({
        calories: calorieGoal,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat
      });
    }
  }, [userData]);

  // Group consumed foods by name, brand, and serving size
  const groupedFoods = consumedFoods.reduce((acc: Record<string, ConsumedFood>, food) => {
    const key = `${food.food_name}-${food.brand_name}-${food.serving_qty}${food.serving_unit}`;
    if (!acc[key]) {
      acc[key] = { ...food, frequency: 1 };
    } else {
      acc[key].frequency! += 1;
    }
    return acc;
  }, {});

  const groupedFoodsArray = Object.values(groupedFoods);

  // Calculate totals
  const totalCalories = groupedFoodsArray.reduce((sum, food) => 
    sum + (food.nf_calories * (food.frequency || 1)), 0);
  
  const totalProtein = groupedFoodsArray.reduce((sum, food) => 
    sum + (food.nf_protein * (food.frequency || 1)), 0);

  const totalCarbs = groupedFoodsArray.reduce((sum, food) => 
    sum + (food.nf_total_carbohydrate * (food.frequency || 1)), 0);

  const totalFat = groupedFoodsArray.reduce((sum, food) => 
    sum + (food.nf_total_fat * (food.frequency || 1)), 0);

  // Calculate percentages of goals
  const caloriePercentage = Math.round((totalCalories / nutritionGoals.calories) * 100) || 0;
  const proteinPercentage = Math.round((totalProtein / nutritionGoals.protein) * 100) || 0;
  const carbsPercentage = Math.round((totalCarbs / nutritionGoals.carbs) * 100) || 0;
  const fatPercentage = Math.round((totalFat / nutritionGoals.fat) * 100) || 0;

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
                <Text style={styles.foodName}>{item.food_name}</Text>
                {item.brand_name && <Text style={styles.foodBrand}>Brand: {item.brand_name}</Text>}
                <Text style={styles.foodServing}>
                  Serving: {item.serving_qty} {item.serving_unit}
                </Text>
                <Text style={styles.foodNutrition}>
                  Calories: {item.nf_calories} cal
                </Text>
                <Text style={styles.foodMacros}>
                  P: {item.nf_protein}g • C: {item.nf_total_carbohydrate}g • F: {item.nf_total_fat}g
                </Text>
              </View>
              <Text style={styles.foodFrequency}>x{item.frequency}</Text>
            </View>
          )}
        />
      )}
  
      {/* ✅ Always show Daily Nutrition */}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  noFoodText: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 20 },
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
  foodInfo: { flex: 1 },
  foodName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  foodBrand: { fontSize: 14, color: "#6c757d", marginBottom: 4 },
  foodServing: { fontSize: 14, color: "#6c757d", marginBottom: 4 },
  foodNutrition: { fontSize: 14, color: "#212529", marginBottom: 2 },
  foodMacros: { fontSize: 14, color: "#495057" },
  foodFrequency: { fontSize: 16, fontWeight: "bold", color: "#0d6efd" },
  totalsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
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