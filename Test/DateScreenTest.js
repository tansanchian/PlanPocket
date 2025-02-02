import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../components/CustomInput";
import { useForm } from "react-hook-form";

export default function DateScreenTest() {
  const onBackPressed = () => {
    console.log("goBack");
  };
  const [meals, setMeals] = useState(2);
  const [otherPressed, setOtherPressed] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [meals2, setMeals2] = useState(true);
  const [meals3, setMeals3] = useState(false);

  const { control, watch, handleSubmit } = useForm();
  const budget = watch("Budget");
  const title = watch("Title");
  const mealBudget = watch("meal");
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onPressDatePicker = () => {
    setShowDatePicker(true);
  };

  const dismiss = () => {
    Keyboard.dismiss();
  };

  const onCreateSchedulePressed = () => {
    console.log("Created");
  };

  return (
    <TouchableWithoutFeedback onPress={dismiss}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.mainTitle}> 1 Day Plan</Text>
        <Text style={styles.firstTitle}>Title</Text>
        <CustomInput
          name="Title"
          control={control}
          placeholder="Title"
          rules={{
            required: "Title is required",
          }}
        />
        <Text style={styles.label}>Budget</Text>
        <CustomInput
          name="Budget"
          control={control}
          placeholder="Budget"
          keyboard="numeric"
          rules={{
            required: "Budget is required",
          }}
        />
        <Text style={styles.label}>How much you spend a meal</Text>
        <CustomInput
          name="meal"
          control={control}
          placeholder="$"
          keyboard="numeric"
          rules={{
            required: "Meal cost is required",
          }}
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
                  placeholderTextColor={"white"}
                  keyboardType="numeric"
                  value={meals}
                  onChangeText={setMeals}
                  autoFocus={true}
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
        <CustomButton
          text="Create"
          onPress={handleSubmit(onCreateSchedulePressed)}
        />
        <CustomButton text="Back" onPress={onBackPressed} type="TERTIARY" />
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
  mainTitle: {
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
  firstTitle: {
    marginTop: 10,
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#40376e",
  },
  label: {
    marginTop: 10,
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
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
