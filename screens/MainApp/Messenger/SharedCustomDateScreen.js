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
import CustomButton from "../../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../../../components/CustomInput";
import { useForm } from "react-hook-form";
import {
  createSharedScheduleDatabase,
  writeScheduleDatabase,
} from "../../../components/Database";

export default function SharedCustomDateScreen({ route }) {
  const { messageData } = route.params;
  const fromDate = messageData.fromDate;
  const toDate = messageData.toDate;

  function dateDifference(dateString1, dateString2) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    return Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  }

  const customDay = parseInt(dateDifference(fromDate, toDate)) + 1;

  const navigation = useNavigation();
  const onBackPressed = () => {
    navigation.goBack();
  };

  function formatDateToCustom(isoString) {
    const date = new Date(isoString);

    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }

  function getDateOnly(isoString) {
    const date = new Date(isoString);
    return date.toISOString().split("T")[0];
  }

  const [meals, setMeals] = useState(2);
  const [otherPressed, setOtherPressed] = useState(false);
  const [meals2, setMeals2] = useState(true);
  const [meals3, setMeals3] = useState(false);

  const dismiss = () => {
    Keyboard.dismiss();
  };

  const { control, watch, handleSubmit } = useForm();
  const budget = watch("Budget");
  const title = watch("Title");
  const mealBudget = watch("meal");

  const onCreateSchedulePressed = async () => {
    try {
      if (otherPressed && meals == 2) {
        return Alert.alert("Please enter the number of meals");
      }
      const result = await createSharedScheduleDatabase(
        title,
        budget,
        meals,
        getDateOnly(new Date(fromDate)),
        getDateOnly(new Date(toDate)),
        mealBudget
      );

      if (result != "404" && result != "402" && result != false) {
        await writeScheduleDatabase(
          result,
          messageData.events[0].category,
          messageData.events[0].purpose,
          messageData.events[0].cost,
          messageData.events[0].description,
          messageData.events[0].fromTime,
          messageData.events[0].toTime
        );
        Alert.alert("Success", "Schedule added successfully");
        navigation.goBack();
      } else if (result == "402") {
        Alert.alert("Error", "Cannot overwrite current schedule!");
      } else if (result == "404") {
        Alert.alert("Error", "Insufficient budget for current meal plan!");
      } else {
        Alert.alert("Error", "Please Try Again!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add schedule: " + error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismiss}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.mainTitle}> {customDay} Day Plan</Text>
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
        <CustomInput
          name="fromDate"
          control={control}
          placeholder={formatDateToCustom(getDateOnly(new Date(fromDate)))}
          editable={false}
        />
        <CustomInput
          name="toDate"
          control={control}
          placeholder={formatDateToCustom(getDateOnly(new Date(fromDate)))}
          editable={false}
        />
        <CustomButton
          text="Next"
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
    backgroundColor: "white",
    width: "100%",
    height: 40,
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
