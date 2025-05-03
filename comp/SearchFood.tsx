import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { FoodContext, openFoodFactsToFoodItem } from "../source/hooks/FoodContext";

const SearchFood = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { addConsumedFood } = useContext(FoodContext);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get("https://world.openfoodfacts.org/cgi/search.pl", {
        params: {
          search_terms: searchTerm,
          search_simple: 1,
          action: "process",
          json: 1,
        },
      });
      setFoodItems(response.data.products || []);
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const handleAddFood = useCallback((item: any) => {
    const foodItem = openFoodFactsToFoodItem(item); // ✅ matches FoodItem interface
    addConsumedFood(foodItem);
  }, [addConsumedFood]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    const nutriments = item.nutriments || {};
    return (
      <View style={styles.foodItem}>
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{item.product_name}</Text>
          {item.brands && <Text style={styles.foodBrand}>Brand: {item.brands}</Text>}
          <Text style={styles.foodNutrition}>
            Serving: {item.serving_size || "100g"}
          </Text>
          <Text style={styles.foodNutrition}>Calories: {nutriments["energy-kcal"] || 0} kcal</Text>
          <Text style={styles.foodNutrition}>Protein: {nutriments.proteins || 0}g</Text>
          <Text style={styles.foodNutrition}>Carbs: {nutriments.carbohydrates || 0}g</Text>
          <Text style={styles.foodNutrition}>Fat: {nutriments.fat || 0}g</Text>
        </View>
        <TouchableOpacity onPress={() => handleAddFood({ product: item })}>
          <AntDesign name="pluscircleo" size={24} color="royalblue" />
        </TouchableOpacity>
      </View>
    );
  }, [handleAddFood]);

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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  loader: { marginBottom: 16 },
  foodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f6f6f8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 18, fontWeight: "bold" },
  foodBrand: { fontSize: 14, color: "#666" },
  foodNutrition: { fontSize: 14, color: "#666" },
  noResultsText: { fontSize: 16, color: "#888", textAlign: "center" },
});

export default SearchFood;
