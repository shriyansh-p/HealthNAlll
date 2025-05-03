import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { storeData } from '../../utils/storage';

const GoalSetup = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [healthCondition, setHealthCondition] = useState('none');
  const [fitnessGoal, setFitnessGoal] = useState('maintenance');
  const [goalIntensity, setGoalIntensity] = useState<'moderate' | 'aggressive'>('moderate');

  const activityLevels = [
    { label: 'Sedentary (little/no exercise)', value: 'sedentary' },
    { label: 'Lightly Active (light exercise 1-3 days/week)', value: 'light' },
    { label: 'Moderately Active (moderate exercise 3-5 days/week)', value: 'moderate' },
    { label: 'Very Active (hard exercise 6-7 days/week)', value: 'active' },
    { label: 'Extremely Active (athlete/training 2x/day)', value: 'extreme' },
  ];

  const healthConditions = [
    { label: 'None', value: 'none' },
    { label: 'Diabetes', value: 'diabetes' },
    { label: 'Heart Disease', value: 'heart_disease' },
    { label: 'Arthritis/Joint Pain', value: 'arthritis' },
    { label: 'Respiratory Issues', value: 'respiratory' },
  ];

  const fitnessGoals = [
    { label: 'Weight Loss', value: 'weight_loss' },
    { label: 'Maintain Weight', value: 'maintenance' },
    { label: 'Muscle Gain', value: 'muscle_gain' },
    { label: 'Improve Cardiovascular Health', value: 'cardio' },
  ];

  const goalIntensityOptions = [
    { label: 'Moderate (sustainable)', value: 'moderate' },
    { label: 'Aggressive (faster, harder)', value: 'aggressive' },
  ];

  const validateInputs = () => {
    if (!weight || !height || !age) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return false;
    }
    if (isNaN(Number(weight)) || isNaN(Number(height)) || isNaN(Number(age))) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for weight, height, and age');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateInputs()) return;

    const userData = {
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      gender,
      activityLevel,
      healthCondition,
      fitnessGoal,
      goalIntensity,
    };

    storeData('userProfile', JSON.stringify(userData));
    onSubmit(userData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Set Your Health Profile</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="Enter your weight"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          placeholder="Enter your height"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholder="Enter your age"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Activity Level</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={activityLevel} onValueChange={setActivityLevel} style={styles.picker}>
            {activityLevels.map((level) => (
              <Picker.Item key={level.value} label={level.label} value={level.value} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Health Condition</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={healthCondition} onValueChange={setHealthCondition} style={styles.picker}>
            {healthConditions.map((condition) => (
              <Picker.Item key={condition.value} label={condition.label} value={condition.value} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fitness Goal</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={fitnessGoal} onValueChange={setFitnessGoal} style={styles.picker}>
            {fitnessGoals.map((goal) => (
              <Picker.Item key={goal.value} label={goal.label} value={goal.value} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Goal Intensity</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={goalIntensity} onValueChange={(val) => setGoalIntensity(val)} style={styles.picker}>
            {goalIntensityOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </View>
      <Button
        title="Generate Recommendations"
        onPress={handleSubmit}
        color="#4CAF50"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default GoalSetup;