import { UserData } from './StepGoalCalculator';

export function calculateWaterIntakeInGlasses(userData: UserData): number {
  // Step 1: Base intake — 35 ml per kg of body weight
  let waterMl = userData.weight * 35;

  // Step 2: Adjust for activity level
  const activityMultipliers: Record<string, number> = {
    sedentary: 1,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    extreme: 1.4,
  };
  waterMl *= activityMultipliers[userData.activityLevel] || 1.1;

  // Step 3: Fitness goal tweaks
  if (['cardio', 'weight_loss'].includes(userData.fitnessGoal)) {
    waterMl += 250;
  }

  // Step 4: Health conditions
  switch (userData.healthCondition) {
    case 'heart_disease':
      waterMl *= 0.9;
      break;
    case 'diabetes':
      waterMl += 250;
      break;
    case 'respiratory':
      waterMl += 150;
      break;
    case 'arthritis':
      waterMl += 200;
      break;
  }

  // Step 5: Age adjustment
  if (userData.age > 65) {
    waterMl *= 0.95;
  }

  // Step 6: Convert to number of glasses (1 glass = 240 ml)
  const glasses = waterMl / 240;

  // Return rounded number of glasses
  return Math.round(glasses);
}
