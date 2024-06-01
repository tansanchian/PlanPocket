import { StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import Navigation from "./navigation/Navigation";
import { initializeApp } from "@firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "./components/AuthContext";
import Location from "./components/Locate";

const firebaseConfig = {
  apiKey: "AIzaSyB4iAMZakxTcCruMaxwge14kWpgDTkADHY",
  authDomain: "planpocket-17a1a.firebaseapp.com",
  projectId: "planpocket-17a1a",
  storageBucket: "planpocket-17a1a.appspot.com",
  messagingSenderId: "949052540769",
  appId: "1:949052540769:web:e9e7d5dc1f99f198ade720",
  databaseURL:
    "https://planpocket-17a1a-default-rtdb.asia-southeast1.firebasedatabase.app",
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.root}>
        <Navigation />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});
