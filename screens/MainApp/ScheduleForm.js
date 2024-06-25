import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { writeScheduleDatabase } from "../../components/Database";
import { StatusBar } from "expo-status-bar";
import { SelectList } from "react-native-dropdown-select-list";

export default function ScheduleForm({ route }) {
  const { titleTT, fromDateTT, toDateTT, budgetTT, mealTT } =
    route.params || {};

  const [selected, setSelected] = useState("");
  const data = [
    { key: "1", value: "Entertainment" },
    { key: "2", value: "Movie" },
    { key: "3", value: "Nothing" },
  ];

  const navigation = useNavigation();

  const { control, handleSubmit, watch } = useForm();
  const description = watch("Description");

  const onAddSchedulePressed = async () => {
    try {
      const result = await writeScheduleDatabase(
        selected,
        description,
        fromDateTT
      );
      if (result) {
        Alert.alert("Success", "Schedule added successfully");
      } else {
        Alert.alert("Error", "Failed to add schedule");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add schedule: " + error.message);
    }
  };

  const onBackPressed = () => {
    navigation.navigate("Timetable");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <StatusBar style="auto" />
        <Text style={styles.title}>{titleTT}</Text>
        <Text style={styles.text}>Date</Text>
        <CustomInput
          name="Date"
          control={control}
          editable={false}
          placeholder={fromDateTT}
        />
        <Text style={styles.text}>Purpose</Text>
        <SelectList
          setSelected={(val) => setSelected(val)}
          data={data}
          save="value"
          search={false}
          boxStyles={styles.boxStyles}
          dropdownStyles={styles.dropdownStyles}
          maxHeight="130"
        />
        <Text style={styles.text}>Description</Text>
        <CustomInput
          name="Description"
          control={control}
          placeholder="Description"
        />
        <CustomButton text="Add" onPress={handleSubmit(onAddSchedulePressed)} />
        <CustomButton text="Back" onPress={onBackPressed} type="TERTIARY" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 50,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  boxStyles: {
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownStyles: {
    height: 130,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});
