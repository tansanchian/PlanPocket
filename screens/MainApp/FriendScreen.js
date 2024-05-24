import { View, Text, StyleSheet } from "react-native";
import React from "react";

const FriendScreen = () => {
  return (
    <View style={styles.form}>
      <Text style={styles.text}>Welcome to FriendScreen</Text>
    </View>
  );
};

export default FriendScreen;

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
