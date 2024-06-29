import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { writeScheduleDatabase } from "../../components/Database";
import { StatusBar } from "expo-status-bar";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";

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

  const [highlightFromDate, setHighlightFromDate] = useState(false);
  const date = new Date();
  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(() => {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);
    return currentTime;
  });
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setToShowTimePicker] = useState(false);
  const [isAllDayEnabled, setIsAllDayEnabled] = useState(false);
  const [previousFromTime, setPreviousFromTime] = useState(new Date());
  const [previousToTime, setPreviousToTime] = useState(() => {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);
    return currentTime;
  });
  const toggleAllDaySwitch = () => {
    setIsAllDayEnabled((previousState) => {
      if (!previousState) {
        setPreviousFromTime(fromTime);
        setPreviousToTime(toTime);
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        setFromTime(startOfDay);
        setToTime(endOfDay);
        setHighlightFromDate(false);
      } else {
        setFromTime(previousFromTime);
        setToTime(previousToTime);
        setHighlightFromDate(previousToTime < previousFromTime);
      }
      return !previousState;
    });
  };
  const onFromTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || fromTime;
    setShowFromTimePicker(false);
    setFromTime(currentTime);
    setHighlightFromDate(toTime < new Date(currentTime));
  };

  const onPressFromTimePicker = () => {
    setShowFromTimePicker(true);
  };

  const onToTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || toTime;
    setToShowTimePicker(false);
    setToTime(currentTime);
    setHighlightFromDate(fromTime > new Date(currentTime));
  };

  const onToPressTimePicker = () => {
    setToShowTimePicker(true);
  };

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
        costs || selectedItem.cost,
        fromTime,
        toTime
      );
      if (result) {
        Alert.alert("Success", "Schedule added successfully");
        navigation.navigate("Timetable");
      } else {
        Alert.alert("Error", "There are other events at this time");
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
          <View
            style={{
              flex: 1,
              alignItems: "flex-start",
            }}
          >
            <View pointerEvents="none">
              <TextInput value={fromDateTT} />
            </View>
          </View>
          <View style={{ flex: 0.05 }}></View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <TouchableOpacity onPress={onPressFromTimePicker}>
                <View pointerEvents="none" style={styles.time}>
                  <TextInput
                    style={styles.timeInput}
                    value={
                      !isAllDayEnabled
                        ? fromTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""
                    }
                  />
                </View>
              </TouchableOpacity>
              {showFromTimePicker && !isAllDayEnabled && (
                <DateTimePicker
                  value={fromTime}
                  mode="time"
                  onChange={onFromTimeChange}
                />
              )}
            </View>
            {!isAllDayEnabled && (
              <View>
                <Text style={{ marginHorizontal: 20 }}> to </Text>
              </View>
            )}
            <View>
              <TouchableOpacity
                onPress={onToPressTimePicker}
                style={styles.time}
              >
                <View pointerEvents="none">
                  <TextInput
                    style={styles.timeInput}
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
                />
              )}
            </View>
          </View>
        </View>
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
            <View style={styles.purposeContainer}>
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
        <CustomButton
          text="Add"
          onPress={
            highlightFromDate
              ? () => Alert.alert("Error", "From date cannot be after to date")
              : selected == ""
              ? () => Alert.alert("Error", "Select an option")
              : handleSubmit(onAddSchedulePressed)
          }
        />

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
  purposeContainer: {
    flexDirection: "row",
  },
});
