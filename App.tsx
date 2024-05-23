import { StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import Navigation from "./navigation/Navigation";
import { initializeApp } from "@firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4iAMZakxTcCruMaxwge14kWpgDTkADHY",
  authDomain: "planpocket-17a1a.firebaseapp.com",
  projectId: "planpocket-17a1a",
  storageBucket: "planpocket-17a1a.appspot.com",
  messagingSenderId: "949052540769",
  appId: "1:949052540769:web:e9e7d5dc1f99f198ade720",
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});
