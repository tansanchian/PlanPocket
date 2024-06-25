import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { writeScheduleDatabase } from "../../components/Database";
import { StatusBar } from "expo-status-bar";
import { SelectList } from "react-native-dropdown-select-list";
import TimeTableScreen from "./TimeTableScreen";

export default function ScheduleForm({ route }) {
  const { titleTT, fromDateTT, toDateTT, budgetTT, mealTT } =
    route.params || {};

  const [selected, setSelected] = useState("");
  const data = [
    { key: "1", value: "Entertainment", cost: "10" },
    { key: "2", value: "Movie", cost: "10" },
    { key: "3", value: "Others", cost: "0" },
  ];

  const navigation = useNavigation();

  const { control, handleSubmit, watch } = useForm();
  const description = watch("Description");
  const others = watch("Others");
  const costs = watch("Costs");

  const onAddSchedulePressed = async () => {
    let selectedValue = selected !== "Others" ? selected : others;
    const selectedItem = data.find((item) => item.value === selected);

    try {
      const result = await writeScheduleDatabase(
        selectedValue,
        description,
        fromDateTT,
        selectedItem
      );
      if (result) {
        Alert.alert("Success", "Schedule added successfully");
        navigation.navigate("Timetable");
      } else {
        Alert.alert("Error", "Failed to add schedule");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add schedule: " + error.message);
    }
  };

  const onUndoPressed = () => {
    setSelected("");
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
        {selected !== "Others" ? (
          <SelectList
            setSelected={(val) => setSelected(val)}
            data={data}
            save="value"
            search={false}
            boxStyles={styles.boxStyles}
            dropdownStyles={styles.dropdownStyles}
            maxHeight={130}
          />
        ) : (
          <>
            <View style={styles.allDayContainer}>
              <View style={{ flex: 1 }}>
                <CustomInput
                  name="Others"
                  control={control}
                  placeholder="Others"
                  rules={{
                    required: "Purpose is required",
                  }}
                />
              </View>
              <View style={{ flex: 0.05 }}></View>
              <View style={{ flex: 1 }}>
                <CustomInput
                  name="Costs"
                  control={control}
                  keyboard="numeric"
                  placeholder="Costs"
                  rules={{
                    required: "Costs is required",
                  }}
                />
              </View>
            </View>
            <CustomButton text="Undo" onPress={onUndoPressed} type="TERTIARY" />
          </>
        )}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
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
  allDayContainer: {
    flexDirection: "row",
  },
});
