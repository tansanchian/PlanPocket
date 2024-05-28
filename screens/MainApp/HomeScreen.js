import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/Header";
import { globalStyles } from "../../styles/global";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Home" />
      <View style={globalStyles.globalContainer}>
        <Text style={styles.text}>Welcome to HomeScreen</Text>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    justifyContent: "center",
    margin: 10,
  },
});
