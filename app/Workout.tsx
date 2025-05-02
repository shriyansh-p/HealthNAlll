import React from 'react';
import { SafeAreaView, StatusBar, Platform } from 'react-native';
import SearchScreen from '../source/Exercise/SearchScreen';

export default function Home() {
    return (
        <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <SearchScreen />
        </SafeAreaView>
    );
}