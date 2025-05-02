import React, { useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { FoodContext } from "../source/hooks/FoodContext";

interface FoodItem {
  food_name: string;
  brand_name?: string;
  serving_qty: number;
  serving_unit: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
}

const SearchFood = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { addConsumedFood } = useContext(FoodContext);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const data = await fetchFromAPI("search/instant", {
        query: searchTerm,
        detailed: true
      });
      // Nutritionix returns branded foods in 'branded' array
      setFoodItems(data.branded || []);
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const renderItem = useCallback(({ item }: { item: FoodItem }) => (
    <View style={styles.foodItem}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.food_name}</Text>
        {item.brand_name && <Text style={styles.foodBrand}>Brand: {item.brand_name}</Text>}
        <Text style={styles.foodNutrition}>
          Serving: {item.serving_qty} {item.serving_unit}
        </Text>
        <Text style={styles.foodNutrition}>Calories: {item.nf_calories} cal</Text>
        <Text style={styles.foodNutrition}>Protein: {item.nf_protein}g</Text>
        <Text style={styles.foodNutrition}>Carbs: {item.nf_total_carbohydrate}g</Text>
        <Text style={styles.foodNutrition}>Fat: {item.nf_total_fat}g</Text>
      </View>
      <TouchableOpacity onPress={() => addConsumedFood(item)}>
        <AntDesign name="pluscircleo" size={24} color="royalblue" />
      </TouchableOpacity>
    </View>
  ), [addConsumedFood]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Food Items</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for food..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
      />
      {loading && <ActivityIndicator size="large" color="royalblue" style={styles.loader} />}
      <FlatList
        data={foodItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={!loading ? <Text style={styles.noResultsText}>No results found.</Text> : null}
      />
    </View>
  );
};

// Keep your existing styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, marginBottom: 16 },
  loader: { marginBottom: 16 },
  foodItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f6f6f8", padding: 16, borderRadius: 8, marginBottom: 16 },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 18, fontWeight: "bold" },
  foodBrand: { fontSize: 14, color: "#666" },
  foodNutrition: { fontSize: 14, color: "#666" },
  noResultsText: { fontSize: 16, color: "#888", textAlign: "center" },
});

export default SearchFood;