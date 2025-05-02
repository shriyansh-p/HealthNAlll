import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, TextInput, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../source/hooks/UserContext'; // ✅ import your user context
import { calculateWaterIntakeInGlasses } from '../source/hooks/WaterCalculator';

export default function WaterTrackerScreen() {
  const { userData } = useUser(); // ✅ get userData from context

  const [glasses, setGlasses] = useState(0);
  const [goal, setGoal] = useState(8);
  const [history, setHistory] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const progress = (glasses / goal) * 100;

  useEffect(() => {
    if (userData) {
      const recommended = calculateWaterIntakeInGlasses(userData);
      setGoal(recommended);
    }
  }, [userData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("💧 Reminder: Time to hydrate!");
    }, 1000 * 60 * 60 * 2);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddGlass = () => {
    setGlasses(prev => prev + 1);
    setHistory(prev => [...prev, new Date().toLocaleTimeString()]);
  };

  const handleReset = () => {
    setGlasses(0);
    setHistory([]);
  };

  const handleSaveGoal = () => {
    const newGoal = parseInt(goalInput);
    if (!isNaN(newGoal) && newGoal > 0) {
      setGoal(newGoal);
      setGlasses(0);
      setHistory([]);
      setModalVisible(false);
      setGoalInput('');
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid number greater than 0.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hydration Tracker</Text>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/728/728093.png' }}
        style={styles.image}
      />
      <Text style={styles.progressText}>{glasses} / {goal} Glasses</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddGlass}>
        <Ionicons name="water" size={24} color="white" />
        <Text style={styles.buttonText}>Add Water</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.goalButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.goalButtonText}>Set Daily Goal</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleReset}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>

      <View style={styles.history}>
        <Text style={styles.historyTitle}>Today's Intake:</Text>
        {history.map((time, index) => (
          <Text key={index} style={styles.historyItem}>💧 {time}</Text>
        ))}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Daily Water Goal</Text>
            <TextInput
              placeholder="Enter number of glasses"
              keyboardType="numeric"
              style={styles.input}
              value={goalInput}
              onChangeText={setGoalInput}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveGoal}>
              <Text style={styles.buttonText}>Save Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.resetText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      padding: 24,
      alignItems: 'center',
      backgroundColor: '#e0f7fa',
      flexGrow: 1,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 30, // was 20
      top:30,
      color: '#0077cc',
    },
    image: {
      width: 80,
      height: 80,
      top: 15,
      marginBottom: 30, // was 20
    },
    progressText: {
      fontSize: 20,
      marginBottom: 20, // was 10
    },
    progressBarContainer: {
      width: '100%',
      height: 12,
      backgroundColor: '#b2ebf2',
      borderRadius: 8,
      marginBottom: 30, // was 20
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#00BFFF',
        borderRadius: 8,
      },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#00BFFF',
      padding: 12,
      paddingHorizontal: 24,
      borderRadius: 30,
      marginBottom: 20, // was 10
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      marginLeft: 8,
    },
    goalButton: {
      marginBottom: 20, // was 10
    },
    goalButtonText: {
      fontSize: 16,
      color: '#0077cc',
      textDecorationLine: 'underline',
    },
    resetText: {
      color: '#666',
      fontSize: 16,
      marginTop: 10, // new padding
    },
    history: {
      marginTop: 30, // was 20
      width: '100%',
    },
    historyTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 18, // was 8
    },
    historyItem: {
      fontSize: 14,
      color: '#444',
      marginBottom: 6, // spacing between entries
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 24,
      borderRadius: 12,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 22, // was 12
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 8,
      width: '100%',
      marginBottom: 26, // was 16
      textAlign: 'center',
    },
  });
  