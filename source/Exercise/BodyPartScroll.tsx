import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, Dimensions, View } from 'react-native';

const BodyPartScroll = ({ bodyParts, selectedBodyPart, setSelectedBodyPart }) => {
    const maxWidth = Math.max(...bodyParts.map(part => part.length * 8 + 30));

    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {bodyParts.map((part) => (
                    <TouchableOpacity
                        key={part}
                        style={[
                            styles.item,
                            selectedBodyPart === part && styles.selectedItem
                        ]}
                        onPress={() => setSelectedBodyPart(part)}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.text,
                                selectedBodyPart === part && styles.selectedText
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {part}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 10,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        paddingHorizontal: 10,
    },
    item: {
        backgroundColor: '#ddd',
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
        height: 40,
    },
    selectedItem: {
        backgroundColor: '#4CAF50',
    },
    text: {
        color: '#333',
        fontWeight: '500',
        fontSize: 14,
        textTransform: 'capitalize',
    },
    selectedText: {
        color: '#fff',
    },
});

export default BodyPartScroll;
