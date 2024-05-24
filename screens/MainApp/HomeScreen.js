import { View, Text, StyleSheet } from "react-native";
import React from "react";

const HomeScreen = () => {
  return (
    <View style={styles.form}>
      <Text style={styles.text}>Welcome to HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    backgroundColor: "pink",
    padding: 20,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
});
