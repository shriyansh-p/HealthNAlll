import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Platform, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useUser } from '../source/hooks/UserContext'; // ✅ useUser hook from context
import { calculateStepGoal, UserData } from '../source/hooks/StepGoalCalculator';
import useHealthData from '../source/hooks/useHealthData';
import RingProgress from '../source/components/RingProgress';
import Value from '../source/components/Value';
import AntDesign from '@expo/vector-icons/AntDesign';
import GoalSetup from '../source/hooks/GoalSetup';

export default function StepsScreen() {
  const [date, setDate] = useState(new Date());
  const { steps, calories, distance } = useHealthData(date);

  const { userData, setUserData } = useUser();
  const [stepGoal, setStepGoal] = useState<number | null>(null);

  // When userData is available, calculate the goal
  useEffect(() => {
    if (userData) {
      const goal = calculateStepGoal(userData);
      setStepGoal(goal);
    }
  }, [userData]);

  const handleUserSubmit = (data: UserData) => {
    setUserData(data); // ✅ Save to global context
    const goal = calculateStepGoal(data);
    setStepGoal(goal);
  };

  const changeDate = (numDays: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    setDate(newDate);
  };

  // Show GoalSetup if step goal isn't set
  if (stepGoal === null) {
    return <GoalSetup onSubmit={handleUserSubmit} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.goalText}>🎯 Your Step Goal: {stepGoal} steps/day</Text>

      <View style={styles.datePicker}>
        <AntDesign onPress={() => changeDate(-1)} name="left" size={20} color="#157DEC" />
        <Text style={styles.date}>{date.toDateString()}</Text>
        <AntDesign onPress={() => changeDate(1)} name="right" size={20} color="#157DEC" />
      </View>

      <RingProgress radius={100} strokeWidth={40} progress={steps / stepGoal} />

      <View style={styles.values}>
        <Value label="Steps" value={steps.toString()} />
        <Value label="Distance" value={distance.toString()} />
        <Value label="Calories" value={calories.toString()} />
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
    padding: 12,
  },
  values: {
    flexDirection: 'row',
    gap: 55,
    flexWrap: 'wrap',
    marginTop: 100,
  },
  datePicker: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  date: {
    color: '#333333',
    fontWeight: '500',
    fontSize: 20,
    marginHorizontal: 20,
  },
  goalText: {
    color: '#157DEC',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
  },
});
