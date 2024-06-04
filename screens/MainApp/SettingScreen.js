import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";

const SettingScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Setting" />
      <View style={styles.internalContainer}>
        <Text style={styles.text}>Welcome to SettingScreen</Text>
      </View>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  internalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3eef6",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    justifyContent: "center",
    margin: 10,
  },
});
