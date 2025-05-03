import { storeData } from '../../utils/storage';

export interface UserData {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  healthCondition: string;
  fitnessGoal: string;
  goalIntensity?: 'moderate' | 'aggressive';
}

export function calculateStepGoal(userData: UserData): number {
  const BASE_RECOMMENDATIONS: Record<string, number> = {
    sedentary: 5000,
    light: 7500,
    moderate: 10000,
    active: 12500,
    extreme: 15000,
  };

  let steps = BASE_RECOMMENDATIONS[userData.activityLevel] || 8000;

  // Goal-based adjustment
  switch (userData.fitnessGoal) {
    case 'weight_loss':
      steps += 2000;
      break;
    case 'muscle_gain':
      steps += 1000;
      break;
    case 'cardio':
      steps += 3000;
      break;
  }

  // Health condition constraints
  switch (userData.healthCondition) {
    case 'diabetes':
      steps = Math.max(7000, steps);
      break;
    case 'heart_disease':
      steps = Math.min(10000, steps);
      break;
    case 'arthritis':
      steps -= 1500;
      break;
    case 'respiratory':
      steps -= 1000;
      break;
  }

  // Age-based adjustments
  if (userData.age > 65) {
    steps -= 1000;
  } else if (userData.age > 50) {
    steps -= 500;
  }

  // Gender-based adjustment
  if (userData.gender === 'female') {
    steps += 500;
  }

  // Goal intensity scaling
  if (userData.goalIntensity === 'aggressive') {
    const intensityBoost = {
      weight_loss: 0.25,
      muscle_gain: 0.15,
      cardio: 0.20,
      maintenance: 0.10,
    };

    const boost = intensityBoost[userData.fitnessGoal] || 0.10;
    steps *= 1 + boost;
  }

  const finalSteps = Math.round(Math.max(3000, Math.min(20000, steps)));
  storeData('recommendedSteps', finalSteps.toString());
  return finalSteps;
}