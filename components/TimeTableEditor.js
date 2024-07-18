import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import { useForm } from "react-hook-form";
import { writeScheduleDatabase, updatePurpose } from "./Database";
import { StatusBar } from "expo-status-bar";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function TimeTableEditor({ id, date }) {
  const [selected, setSelected] = useState("");
  const data = [
    { key: "1", value: "Entertainment & Leisure" },
    { key: "2", value: "Transportation" },
    { key: "3", value: "Bill, Utilities & Taxes" },
    { key: "4", value: "Dining" },
    { key: "5", value: "Shopping" },
    { key: "6", value: "Uncategorized" },
  ];

  function toSGTISOString(fromTime) {
    const date = new Date(fromTime);

    const utcTime = date.getTime() + date.getTimezoneOffset();

    const sgtTime = new Date(utcTime + 8 * 60 * 60 * 1000);

    return sgtTime.toISOString();
  }

  const [highlightFromDate, setHighlightFromDate] = useState(false);
  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(() => {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);

    const maxTime = new Date();
    maxTime.setHours(23, 59, 0, 0);

    if (currentTime > maxTime) {
      return maxTime;
    }

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
  const purpose = watch("Purpose");
  const costs = watch("Costs");

  const onUpdateSchedulePressed = async () => {
    try {
      const dataToUpdate = {
        category: selected,
        costs: costs,
        description: description || "",
        fromTime: toSGTISOString(fromTime),
        purpose: purpose,
        toTime: toSGTISOString(toTime),
      };
      await updatePurpose(id, dataToUpdate);
      Alert.alert("Update", "Update Completed");
    } catch (e) {
      console.error("Updating purpose", e);
    }
  };

  const onUndoPressed = () => {
    setSelected("");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <StatusBar style="dark" />
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
              <TextInput value={date} />
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
        {selected == "" ? (
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
            <SelectList
              setSelected={(val) => setSelected(val)}
              defaultOption={selected}
              placeholder={selected}
              data={data}
              save="value"
              search={false}
              boxStyles={styles.boxStyles}
              dropdownStyles={styles.dropdownStyles}
              maxHeight={130}
            />
            <View style={styles.purposeContainer}>
              <View style={{ flex: 1 }}>
                <CustomInput
                  name="Purpose"
                  control={control}
                  placeholder="Purpose"
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
          text="Update"
          onPress={
            highlightFromDate
              ? () => Alert.alert("The end time must be after the start time")
              : selected == ""
              ? () => Alert.alert("Error", "Select an option")
              : handleSubmit(onUpdateSchedulePressed)
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
