import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import ExerciseCard from './ExerciseCard';
import BodyPartScroll from './BodyPartScroll';
import { searchExercises, getBodyParts } from '../../utils/api';

const SearchScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [exercises, setExercises] = useState([]);
    const [bodyParts, setBodyParts] = useState([]);
    const [selectedBodyPart, setSelectedBodyPart] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            setLoading(true);
            setError(null);
            const results = await searchExercises(searchTerm, selectedBodyPart);
            setExercises(results);
        } catch (err) {
            setError('Failed to search exercises');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchBodyParts = async () => {
            try {
                setLoading(true);
                const data = await getBodyParts();
                setBodyParts(['all', ...data]);
            } catch (err) {
                setError('Failed to load body parts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBodyParts();
    }, []);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setLoading(true);
                setError(null);
                const results = await searchExercises('', selectedBodyPart);
                setExercises(results);
            } catch (err) {
                setError('Failed to load exercises');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, [selectedBodyPart]);

    return (
        <View style={styles.container}>
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
            />

            <BodyPartScroll
                bodyParts={bodyParts}
                selectedBodyPart={selectedBodyPart}
                setSelectedBodyPart={setSelectedBodyPart}
            />

            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : exercises.length > 0 ? (
                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ExerciseCard exercise={item} />}
                    contentContainerStyle={styles.listContent}
                    initialNumToRender={20}
                    maxToRenderPerBatch={50}
                    windowSize={21}
                    removeClippedSubviews={true}
                />
            ) : (
                <Text style={styles.empty}>No exercises found. Try a different search.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loader: {
        marginTop: 20,
    },
    error: {
        textAlign: 'center',
        marginTop: 20,
        color: 'red',
        fontSize: 16,
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#555',
    },
    listContent: {
        paddingBottom: 20,
    },
});

export default SearchScreen;
