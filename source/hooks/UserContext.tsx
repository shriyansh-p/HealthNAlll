import React, { createContext, useContext, useEffect, useState } from 'react';
import { getData, storeData } from '../../utils/storage';

export type UserData = {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  healthCondition: string;
  fitnessGoal: string;
  goalIntensity?: 'moderate' | 'aggressive';
};

type UserContextType = {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
  clearUserData: () => {},
  isLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from storage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedData = await getData('userProfile');
        if (savedData) {
          setUserData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Update storage whenever user data changes
  useEffect(() => {
    if (userData) {
      storeData('userProfile', JSON.stringify(userData));
    }
  }, [userData]);

  const handleSetUserData = (data: UserData) => {
    setUserData(data);
  };

  const clearUserData = () => {
    setUserData(null);
    storeData('userProfile', '');
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData: handleSetUserData,
        clearUserData,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);