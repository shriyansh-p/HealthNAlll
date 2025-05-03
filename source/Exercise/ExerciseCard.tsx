import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ExerciseCard = ({ exercise }) => {
    return (
        <View style={styles.card}>
            <Image
                source={{ uri: exercise.gifUrl }}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.name}>{exercise.name}</Text>
            <Text style={styles.details}>Target: {exercise.target}</Text>
            <Text style={styles.details}>Equipment: {exercise.equipment}</Text>
            <Text style={styles.details}>Body Part: {exercise.bodyPart}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        textTransform: 'capitalize',
    },
    details: {
        color: '#555',
        marginBottom: 3,
        textTransform: 'capitalize',
    },
});

export default ExerciseCard;