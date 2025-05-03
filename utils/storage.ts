import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error storing data', e);
    throw e;
  }
};

export const getData = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error('Error reading data', e);
    return null;
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing data', e);
    throw e;
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.multiRemove([
      'userProfile',
      'recommendedSteps',
      'calorieGoal',
      'macros',
      'recommendedWater',
      

      // Add any other user-specific storage keys here
    ]);
  } catch (e) {
    console.error('Error clearing user data', e);
    throw e;
  }
};