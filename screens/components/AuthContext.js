import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = async (customToken) => {
    setIsLoading(true);
    try {
      setUserToken(customToken);
      await AsyncStorage.setItem("userToken", customToken);
      console.log("Login: Token set successfully");
    } catch (e) {
      console.warn(`Login error: ${e}`);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    try {
      await AsyncStorage.removeItem("userToken");
      console.log("Logout: Token removed successfully");
    } catch (e) {
      console.warn(`Logout error: ${e}`);
    }
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem("userToken");
      setUserToken(userToken);
      setIsLoading(false);
    } catch (e) {
      console.warn(`isLogged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};
