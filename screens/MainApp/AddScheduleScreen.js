import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { globalStyles } from "../../styles/global";

const AddScheduleScreen = () => {
  const navigation = useNavigation();

  const onAddSchedulePressed = () => {
    console.log("onAddSchedulePressed");
    navigation.navigate("ScheduleForm");
  };

  return (
    <View style={styles.container}>
      <Header title="AddSchedule" />
      <View style={globalStyles.globalContainer}>
        <Text style={styles.text}>No Current Event</Text>
        <CustomButton text="Add Schedule" onPress={onAddSchedulePressed} />
      </View>
    </View>
  );
};

export default AddScheduleScreen;

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
    margin: 10,
    textAlign: "center",
  },
});
