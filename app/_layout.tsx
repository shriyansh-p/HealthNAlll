import { Tabs } from 'expo-router/tabs';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { FoodProvider } from '../source/hooks/FoodContext';
import { UserProvider } from '../source/hooks/UserContext';

export default function Layout() {
  return (
    <UserProvider>
      <FoodProvider>
        <Tabs
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'index') {
                return <MaterialCommunityIcons name="home" size={size} color={color} />;
              } else if (route.name === 'Steps') {
                return <MaterialCommunityIcons name="walk" size={size} color={color} />;
              } else if (route.name === 'search') {
                return <AntDesign name="search1" size={size} color={color} />;
              } else if (route.name === 'consumed') {
                return <AntDesign name="bars" size={size} color={color} />;
              } else if (route.name === 'Workout') {
                return <MaterialCommunityIcons name="dumbbell" size={size} color={color} />;
              }else if (route.name === 'Water') {
                return <MaterialCommunityIcons name="water" size={size} color={color}/>;
              }
              return <AntDesign name="question" size={size} color={color} />;
            },
            tabBarActiveTintColor: '#C3FF53',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: 'black',
              borderTopColor: '#333',
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
            headerShown: false,
          })}
        >
          <Tabs.Screen name="index" options={{ title: 'Home' }} />
          <Tabs.Screen name="Steps" options={{ title: 'Steps' }} />
          <Tabs.Screen name="search" options={{ title: 'Search' }} />
          <Tabs.Screen name="consumed" options={{ title: 'Food Log' }} />
          <Tabs.Screen name="Workout" options={{ title: 'Workout' }} />
          <Tabs.Screen name="Water" options={{ title: 'Water' }} />
        </Tabs>
      </FoodProvider>
    </UserProvider>
  );
}
