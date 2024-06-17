import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";

const AddScheduleScreen = () => {
  const navigation = useNavigation();

  const onAddSchedulePressed = () => {
    navigation.navigate("ChooseDate");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="AddSchedule" />
      <View style={styles.internalContainer}>
        <Text style={styles.text}>No Current Event</Text>
        <CustomButton text="Add Schedule" onPress={onAddSchedulePressed} />
      </View>
    </View>
  );
};

export default AddScheduleScreen;

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
