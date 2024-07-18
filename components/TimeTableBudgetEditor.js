import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import { useForm } from "react-hook-form";
import { updateBudget } from "./Database";
import { StatusBar } from "expo-status-bar";

export default function TimeTableBudgetEditor({ item }) {
  const { control, handleSubmit, watch, setValue } = useForm();
  const title = watch("Title");
  const budget = watch("Budget");

  const onUpdateSchedulePressed = async () => {
    try {
      const dataToUpdate = {
        title: title,
        budget: budget,
      };
      await updateBudget(item[0], dataToUpdate);
      Alert.alert("Update", "Update Completed");
    } catch (e) {
      console.error("Updating purpose", e);
    }
  };

  useEffect(() => {
    if (item && item.data) {
      setValue("Title", item[1].title || "");
      setValue("Budget", item[1].budget || "");
    }
  }, [item]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <StatusBar style="dark" />
        <Text style={styles.text}>Title</Text>
        <CustomInput
          name="Title"
          control={control}
          placeholder={item[1].title}
          rules={{
            required: "Title is required",
          }}
        />
        <Text style={styles.text}>Budget</Text>
        <CustomInput
          name="Budget"
          control={control}
          placeholder={"$" + item[1].budget}
          rules={{
            required: "Budget is required",
          }}
        />
        <CustomButton
          text="Update"
          onPress={handleSubmit(onUpdateSchedulePressed)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
  text: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
});