import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

export default function DateScreen() {
  const navigation = useNavigation();

  const Back = () => {
    navigation.navigate("ChooseDate");
  };
  const [meals, setMeals] = useState(null);
  const [otherMeals, setOtherMeals] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.label}>How many meals a day?</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={meals === 2 ? styles.selectedButton : styles.button}
          onPress={() => setMeals(2)}
        >
          <Text style={styles.buttonText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={meals === 3 ? styles.selectedButton : styles.button}
          onPress={() => setMeals(3)}
        >
          <Text style={styles.buttonText}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={meals === "other" ? styles.selectedButton : styles.button}
          onPress={() => setMeals("other")}
        >
          <Text style={styles.buttonText}>Other</Text>
        </TouchableOpacity>
        {meals === "other" && (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={otherMeals}
            onChangeText={setOtherMeals}
          />
        )}
      </View>
      <View style={styles.datePicker}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
          <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={Back}>
        <Text style={styles.addButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: "#e3d7f2",
  },
  selectedButton: {
    borderWidth: 1,
    borderColor: "#967bb6",
    backgroundColor: "#967bb6",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: 60,
    backgroundColor: "#f9f9f9",
  },
  datePicker: {
    marginBottom: 20,
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
