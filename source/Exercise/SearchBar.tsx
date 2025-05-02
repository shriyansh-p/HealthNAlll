import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const SearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search exercises..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={styles.input}
                placeholderTextColor="#999"
                onSubmitEditing={onSearch}
            />
            <TouchableOpacity style={styles.button} onPress={onSearch}>
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        margin: 15,
        marginBottom: 5,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        paddingHorizontal: 15,
        marginRight: 10,
        borderRadius: 25,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SearchBar;