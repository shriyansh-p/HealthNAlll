// Activity multipliers for Mifflin-St Jeor
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extreme: 1.9,
};

// Goal adjustments based on intensity
const GOAL_ADJUSTMENTS = {
  weight_loss: { moderate: -300, aggressive: -500 },
  maintenance: { moderate: 0, aggressive: 0 },
  muscle_gain: { moderate: 250, aggressive: 400 },
  cardio: { moderate: -200, aggressive: -300 },
};

// Health impact on calories
const HEALTH_ADJUSTMENTS = {
  none: 0,
  diabetes: -200,
  heart_disease: -150,
  arthritis: -100,
  respiratory: -50,
};

// Main user input model
export interface UserData {
  weight: number; // in kg
  height: number; // in cm
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: keyof typeof ACTIVITY_MULTIPLIERS;
  healthCondition: keyof typeof HEALTH_ADJUSTMENTS;
  fitnessGoal: keyof typeof GOAL_ADJUSTMENTS;
  goalIntensity?: 'moderate' | 'aggressive';
}

// ✅ BMR with Mifflin-St Jeor
function getBMR({ weight, height, age, gender }: UserData): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// ✅ Total daily calorie goal
export const calculateCalorieGoal = (userData: UserData): number => {
  const {
    activityLevel,
    healthCondition,
    fitnessGoal,
    goalIntensity = 'moderate',
  } = userData;

  const bmr = getBMR(userData);
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  const maintenanceCalories = bmr * activityMultiplier;

  const goalAdjustment = GOAL_ADJUSTMENTS[fitnessGoal]?.[goalIntensity] ?? 0;
  const healthAdjustment = HEALTH_ADJUSTMENTS[healthCondition] ?? 0;

  const finalCalories = Math.round(maintenanceCalories + goalAdjustment + healthAdjustment);
  return Math.max(1200, finalCalories);
};

// ✅ Macronutrient split
export const calculateMacros = (calorieGoal: number, userData: UserData) => {
  const { weight, fitnessGoal } = userData;

  if (!calorieGoal || isNaN(calorieGoal)) {
    console.warn('Invalid calorieGoal input:', calorieGoal);
    return {
      protein: 0,
      fat: 0,
      carbs: 0,
    };
  }

  const proteinPerKg = {
    weight_loss: 2.0,
    muscle_gain: 2.2,
    cardio: 1.6,
    maintenance: 1.8,
  }[fitnessGoal] ?? 1.8;

  const proteinGrams = Math.round(weight * proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  const fatCalories = calorieGoal * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  const carbCalories = calorieGoal - (proteinCalories + fatCalories);
  const carbGrams = Math.max(0, Math.round(carbCalories / 4));

  return {
    protein: proteinGrams,
    fat: fatGrams,
    carbs: carbGrams,
  };
};
