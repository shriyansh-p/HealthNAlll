// app/UserContext.tsx
import React, { createContext, useState, useContext } from "react";
import { UserData } from "./CalorieCalculator";

type UserContextType = {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
};

export const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
