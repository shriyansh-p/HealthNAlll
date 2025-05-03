import React from "react";
import { View } from "react-native";
import FoodLog from "../comp/FoodLog";
import { useUser } from "../source/hooks/UserContext";

export default function ConsumedScreen() {
  const { userData } = useUser();

  if (!userData) return null;

  return (
    <View style={{ flex: 1 }}>
      <FoodLog userData={userData} />
    </View>
  );
}
