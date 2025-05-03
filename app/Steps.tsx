import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useUser } from '../source/hooks/UserContext';
import { calculateStepGoal } from '../source/hooks/StepGoalCalculator';
import useHealthData from '../source/hooks/useHealthData';
import RingProgress from '../source/components/RingProgress';
import Value from '../source/components/Value';
import AntDesign from '@expo/vector-icons/AntDesign';
import { storeData, getData, clearUserData } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import GoalSetup from '../source/hooks/GoalSetup';

const StepsScreen = () => {
  const [date, setDate] = useState(new Date());
  const { steps, calories, distance } = useHealthData(date);
  const { userData, setUserData } = useUser();
  const [stepGoal, setStepGoal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedGoal = await getData('recommendedSteps');
        if (savedGoal) {
          setStepGoal(Number(savedGoal));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load your step goal');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (userData && !stepGoal) {
      const goal = calculateStepGoal(userData);
      setStepGoal(goal);
      storeData('recommendedSteps', goal.toString());
    }
  }, [userData]);

  const handleUserSubmit = async (data: any) => {
    try {
      setUserData(data);
      const goal = calculateStepGoal(data);
      setStepGoal(goal);
      await storeData('recommendedSteps', goal.toString());
    } catch (error) {
      Alert.alert('Error', 'Failed to save your goal');
    }
  };

  const changeDate = (numDays: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    setDate(newDate);
  };

  const handleResetAll = async () => {
    try {
      await clearUserData();
      setStepGoal(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to reset your data');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6EB38A" />
      </View>
    );
  }

  if (!stepGoal) {
    return <GoalSetup onSubmit={handleUserSubmit} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.goalText}>🎯 Daily Goal: {stepGoal.toLocaleString()} steps</Text>
        <TouchableOpacity style={styles.button} onPress={handleResetAll}>
          <Text style={styles.resetButton}>Reset Goal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.datePicker}>
        <AntDesign
          onPress={() => changeDate(-1)}
          name="left"
          size={20}
          color="#157DEC"
        />
        <Text style={styles.date}>{date.toDateString()}</Text>
        <AntDesign
          onPress={() => changeDate(1)}
          name="right"
          size={20}
          color="#157DEC"
        />
      </View>

      <View style={styles.progressContainer}>
        <RingProgress
          radius={100}
          strokeWidth={40}
          progress={Math.min(steps / stepGoal, 1)}
        />
        <Text style={styles.progressText}>
          {Math.round((steps / stepGoal) * 100)}% completed
        </Text>
      </View>

      <View style={styles.values}>
        <Value label="Steps" value={steps.toLocaleString()} />
        <Value label="Distance" value={`${distance.toFixed(2)} km`} />
        <Value label="Calories" value={calories.toLocaleString()} />
      </View>

      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  goalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3B36',
    top:50
  },
  button: {
    backgroundColor: '#6EB38A',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: 'flex-start',
    marginTop: 30,
  },
  resetButton: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 15,
    color: '#333',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  progressText: {
    marginTop: 15,
    fontSize: 16,
    color: '#4A635C',
  },
  values: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
});

export default StepsScreen;