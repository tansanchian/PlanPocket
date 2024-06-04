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

const ScheduleForm = () => {
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
        date.toLocaleDateString("fr-FR"),
        !isAllDayEnabled
          ? toTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "11.59pm",
        toDate.toLocaleDateString("fr-FR"),
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
        <CustomInput
          name="Purpose"
          placeholder="Purpose"
          control={control}
          rules={{ required: "Purpose is required" }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "centre",
          }}
        >
          Budget Availablity
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                borderRadius: 25,
                paddingVertical: 15,
                alignItems: "center",
                marginVertical: 10,
                backgroundColor: available ? "#735DA5" : "#D3C5E5",
              }}
              onPress={onApplicablePressed}
            >
              <Text style={{ color: "white" }}>Budget available</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.05 }} />
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                borderRadius: 25,
                paddingVertical: 15,
                marginVertical: 10,
                alignItems: "center",
                backgroundColor: available ? "#D3C5E5" : "#735DA5",
              }}
              onPress={onNotApplicablePressed}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Budget Not available
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {available && (
          <>
            <CustomInput
              name="Budget"
              placeholder="Budget"
              control={control}
              rules={{ required: "Budget is required" }}
            />
          </>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Text style={styles.text}>All-day</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Switch
              trackColor={{ false: "#fff", true: "#fff" }}
              thumbColor={isAllDayEnabled ? "#735DA5" : "#D3C5E5"}
              ios_backgroundColor="#735DA5"
              onValueChange={toggleAllDaySwitch}
              value={isAllDayEnabled}
            />
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
            {showTimePicker && !isAllDayEnabled && (
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
        <Text style={styles.text}>Others</Text>
        <View>
          <Text>Location</Text>
        </View>
        <CustomInput name="Others" control={control} placeholder="Others" />
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
  switch: {},
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
