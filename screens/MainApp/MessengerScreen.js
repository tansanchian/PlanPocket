import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/Header";

const MessengerScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Messenger" />
      <View style={styles.internalContainer}>
        <Text style={styles.text}>Welcome to MessengerScreen</Text>
      </View>
    </View>
  );
};

export default MessengerScreen;

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
