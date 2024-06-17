import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";

const ChooseDateScreen = () => {
  const navigation = useNavigation();

  const addOneDay = () => {
    navigation.navigate("DateScreen");
  };
  const addOneWeek = () => {
    navigation.navigate("ScheduleForm");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.internalContainer}>
        <Text style={styles.text}>Choose your plan</Text>
        <CustomButton text="1 Day" onPress={addOneDay} />
        <CustomButton text="1 Week" onPress={addOneWeek} />
      </View>
    </View>
  );
};

export default ChooseDateScreen;

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
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    justifyContent: "center",
    margin: 10,
  },
});
