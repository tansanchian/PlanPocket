import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

const AddScheduleScreen = () => {
  const navigation = useNavigation();

  const onAddSchedulePressed = () => {
    console.log("onAddSchedulePressed");
    navigation.navigate("ScheduleForm");
  };

  return (
    <View style={styles.form}>
      <Text style={styles.text}>No Current Event</Text>
      <CustomButton text="Add Schedule" onPress={onAddSchedulePressed} />
    </View>
  );
};

export default AddScheduleScreen;

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
    textAlign: "center",
  },
});
