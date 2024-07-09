import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import Modal from "react-native-modal";

const ChooseDateScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [customDays, setCustomDays] = useState("");

  const addOneDay = () => {
    navigation.navigate("DateScreen");
  };
  const addOneWeek = () => {
    navigation.navigate("WeekScreen");
  };
  const addOneMonth = () => {
    navigation.navigate("MonthScreen");
  };

  const addCustomDay = () => {
    setModalVisible(true);
  };

  const handleCustomDaySubmit = () => {
    if (customDays) {
      navigation.navigate("CustomDayScreen", { days: customDays });
      setModalVisible(false);
    } else {
      alert("Please enter a number of days.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.internalContainer}>
        <Text style={styles.text}>Choose your plan</Text>
        <CustomButton text="1 Day" onPress={addOneDay} />
        <CustomButton text="1 Week" onPress={addOneWeek} />
        <CustomButton text="1 Month" onPress={addOneMonth} />
        <CustomButton text="Custom Day" onPress={addCustomDay} />
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Enter number of custom days:</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of days"
            keyboardType="numeric"
            value={customDays}
            onChangeText={setCustomDays}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCustomDaySubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChooseDateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  internalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3eef6",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    justifyContent: "center",
    margin: 10,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    backgroundColor: "#051C60",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "45%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  cancelButtonText: {
    color: "#051C60",
  },
});
