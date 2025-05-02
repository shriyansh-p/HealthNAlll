import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomePage = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Steps');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('./assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brandName}>HealthNAll</Text>
        </View>

        {/* Title & Button */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Plan your healthy lifestyle</Text>
          <Text style={styles.subtitle}>
            Set your fitness and health goals, track your progress, and achieve your wellness targets.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* Image Composition */}
        <View style={styles.illustrationWrapper}>
          <Image
            source={require('./assets/illustration.png')}
            style={[styles.runnerImage, {
              width: screenWidth * 0.9,
              height: screenWidth * 0.9,
            }]}
            resizeMode="contain"
          />
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D3B36',
    marginLeft: 10,
  },
  titleSection: {
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2D3B36',
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 18,
    color: '#4A635C',
    marginTop: 20,
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#6EB38A',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: 'flex-start',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  illustrationWrapper: {
    marginTop: 40,
    height: screenWidth * 0.9,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  runnerImage: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  chartImage: {
    position: 'absolute',
  },
  appleImage: {
    position: 'absolute',
  },
});

export default HomePage;
