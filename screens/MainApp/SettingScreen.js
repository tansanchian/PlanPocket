import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";

const SettingScreen = () => {
  return (
    <View style={styles.form}>
      <Text style={styles.text}>Welcome to SettingScreen</Text>
    </View>
  );
};

export default SettingScreen;

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
