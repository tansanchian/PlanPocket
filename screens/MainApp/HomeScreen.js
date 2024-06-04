import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/Header";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Home" />
      <View style={styles.internalContainer}>
        <Text style={styles.text}>Welcome to HomeScreen</Text>
      </View>
    </View>
  );
};

export default HomeScreen;

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
