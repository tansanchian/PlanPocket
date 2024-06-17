import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
  Switch,
} from "react-native";

import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { writeScheduleDatabase } from "../../components/Database";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import { SelectList } from "react-native-dropdown-select-list";

const ScheduleForm = () => {
  const [selected, setSelected] = useState("");
  const data = [
    { key: "1", value: "Entertainment" },
    { key: "2", value: "Movie" },
    { key: "3", value: "Nothing" },
  ];

  const navigation = useNavigation();
  const [available, setAvailable] = useState(true);
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [toTime, setToTime] = useState(() => {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);
    return currentTime;
  });
  const [toDate, setToDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showToDatePicker, setToShowDatePicker] = useState(false);
  const [showToTimePicker, setToShowTimePicker] = useState(false);
  const [highlightFromDate, setHighlightFromDate] = useState(false);

  const stringifyDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [isAllDayEnabled, setIsAllDayEnabled] = useState(false);
  const toggleAllDaySwitch = () => {
    setIsAllDayEnabled((previousState) => !previousState);
    setHighlightFromDate(false);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setHighlightFromDate(new Date(date) < new Date(currentDate));
  };

  const onTimeChange = (event, selectedTime) => {
    const currentDate = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentDate);
    setHighlightFromDate(new Date(date) < new Date(currentDate));
  };

  const onPressDatePicker = () => {
    setShowDatePicker(true);
  };

  const onPressTimePicker = () => {
    setShowTimePicker(true);
  };

  const onToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setToShowDatePicker(false);
    setToDate(currentDate);
    setHighlightFromDate(new Date(date) > new Date(currentDate));
  };

  const onToTimeChange = (event, selectedTime) => {
    const currentDate = selectedTime || time;
    setToShowTimePicker(false);
    setToTime(currentDate);
    setHighlightFromDate(new Date(date) > new Date(currentDate));
  };

  const onToPressDatePicker = () => {
    setToShowDatePicker(true);
  };

  const onToPressTimePicker = () => {
    setToShowTimePicker(true);
  };

  const { control, handleSubmit, watch } = useForm();
  const purpose = watch("Purpose");
  const budget = available ? watch("Budget") : "";
  const others = watch("Others");

  const onAddSchedulePressed = async () => {
    try {
      const result = await writeScheduleDatabase(
        purpose,
        budget,
        !isAllDayEnabled
          ? time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "12.00am",
        stringifyDate(date),
        !isAllDayEnabled
          ? toTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "11.59pm",
        stringifyDate(toDate),
        others
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
    navigation.navigate("AddSchedule");
  };

  const onApplicablePressed = () => {
    setAvailable(true);
  };

  const onNotApplicablePressed = () => {
    setAvailable(false);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <StatusBar style="auto" />
        <Text style={styles.title}>Add Schedule</Text>
        <Text style={styles.text}>Purpose</Text>
        <SelectList
          setSelected={(val) => setSelected(val)}
          data={data}
          save="value"
          Number="2"
          defaultOption={{ key: "3", value: "Nothing" }}
          search={false}
          boxStyles={styles.purpose}
          maxHeight="130"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Text style={styles.text}>Date</Text>
          </View>
        </View>
        <View
          style={[
            styles.allDayContainer,
            highlightFromDate && { borderColor: "red", borderWidth: 1 },
          ]}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={onPressDatePicker}>
              <View pointerEvents="none">
                <TextInput value={date.toLocaleDateString("fr-FR")} />
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
              />
            )}
          </View>
          <View style={{ flex: 0.05 }}></View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={onPressTimePicker}>
              <View pointerEvents="none">
                <TextInput
                  style={{ alignSelf: "flex-end" }}
                  value={
                    !isAllDayEnabled
                      ? time.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""
                  }
                />
              </View>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                onChange={onTimeChange}
                display={Platform.OS === "ios" ? "spinner" : "default"}
              />
            )}
          </View>
        </View>
        <View style={styles.allDayContainer}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={onToPressDatePicker}>
              <View pointerEvents="none">
                <TextInput value={toDate.toLocaleDateString("fr-FR")} />
              </View>
            </TouchableOpacity>
            {showToDatePicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onToDateChange}
              />
            )}
          </View>
          <View style={{ flex: 0.05 }}></View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={onToPressTimePicker}>
              <View pointerEvents="none">
                <TextInput
                  style={{ alignSelf: "flex-end" }}
                  value={
                    !isAllDayEnabled
                      ? toTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""
                  }
                />
              </View>
            </TouchableOpacity>
            {showToTimePicker && !isAllDayEnabled && (
              <DateTimePicker
                value={toTime}
                mode="time"
                onChange={onToTimeChange}
                display={Platform.OS === "ios" ? "spinner" : "default"}
              />
            )}
          </View>
        </View>
        <Text style={styles.text}>Description</Text>
        <CustomInput
          name="Description"
          control={control}
          placeholder="Description"
        />
        <CustomButton
          text="Add"
          onPress={
            highlightFromDate
              ? () => Alert.alert("Error", "From date cannot be after to date")
              : handleSubmit(onAddSchedulePressed)
          }
        />
        <CustomButton text="Back" onPress={onBackPressed} type="TERTIARY" />
      </View>
    </ScrollView>
  );
};

export default ScheduleForm;

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
  container2: {
    backgroundColor: "white",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 25,
  },
  purpose: {
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
  },
  allDayContainer: {
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
  },
});
