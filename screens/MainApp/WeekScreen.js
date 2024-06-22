import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

export default function WeekScreen() {
  const navigation = useNavigation();
  const onBackPressed = () => {
    navigation.navigate("ChooseDate");
  };
  const [meals, setMeals] = useState(2);
  const [otherPressed, setOtherPressed] = useState(false);
  const [date, setDate] = useState(new Date());
  const laterDate = new Date();
  laterDate.setDate(laterDate.getDate() + 7);
  const [toDate, setToDate] = useState(laterDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showToDatePicker, setToShowDatePicker] = useState(false);
  const [title, setTitle] = useState("");
  const [meals2, setMeals2] = useState(true);
  const [meals3, setMeals3] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    const newToDate = new Date(currentDate);
    newToDate.setDate(newToDate.getDate() + 7);
    setToDate(newToDate);
  };

  const onPressDatePicker = () => {
    setShowDatePicker(true);
  };

  const onToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setToShowDatePicker(false);
    setToDate(currentDate);
    const newFromDate = new Date(currentDate);
    newFromDate.setDate(newFromDate.getDate() - 7);
    setDate(newFromDate);
  };

  const onToPressDatePicker = () => {
    setToShowDatePicker(true);
  };

  const getMinimumToDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today;
  };

  const dismiss = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismiss}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.label}>Title</Text>
        <CustomInput name="Title" control={control} placeholder="Title" />
        <Text style={styles.label}>Budget</Text>
        <CustomInput
          name="Budget"
          control={control}
          placeholder="Budget"
          keyboard="numeric"
        />
        <Text style={styles.label}>How many meals a day?</Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={meals2 ? styles.selectedButton : styles.button}
              onPress={() => {
                setMeals(2);
                setOtherPressed(false);
                setMeals3(false);
                setMeals2(true);
              }}
            >
              <Text style={styles.buttonText}>2</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.05 }} />
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={meals3 ? styles.selectedButton : styles.button}
              onPress={() => {
                setMeals(3);
                setOtherPressed(false);
                setMeals2(false);
                setMeals3(true);
              }}
            >
              <Text style={styles.buttonText}>3</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.05 }} />
          <View style={{ flex: 1 }}>
            {otherPressed ? (
              <View style={styles.selectedButton}>
                <TextInput
                  style={{ textAlign: "center", color: "white" }}
                  placeholder="Enter"
                  placeholderTextColor={"white"}
                  keyboardType="numeric"
                  value={meals}
                  onChangeText={setMeals}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setOtherPressed(true);
                  setMeals2(false);
                  setMeals3(false);
                }}
              >
                <Text style={styles.buttonText}>Other</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.label}>Date</Text>
        <View style={styles.datePicker}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={onPressDatePicker}>
              <View pointerEvents="none">
                <TextInput value={date.toDateString()} />
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
        </View>
        <View style={styles.datePicker}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={onToPressDatePicker}>
              <View pointerEvents="none">
                <TextInput value={toDate.toDateString()} />
              </View>
            </TouchableOpacity>
            {showToDatePicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                onChange={onToDateChange}
                minimumDate={getMinimumToDate()}
              />
            )}
          </View>
        </View>
        <CustomButton text="Add" onPress={() => console.log(meals)} />
        <CustomButton text="Back" onPress={onBackPressed} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 0,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#40376e",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#D3C5E5",
  },
  selectedButton: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 15,
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: "#735DA5",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  datePicker: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#e3d7f2",
  },
  dateButtonText: {
    color: "#40376e",
  },
  addButton: {
    backgroundColor: "#967bb6",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
