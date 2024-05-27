import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { getAuth } from "@firebase/auth";
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  push,
  update,
} from "@firebase/database";
import DateTimePicker from "@react-native-community/datetimepicker";

const ScheduleForm = () => {
  const navigation = useNavigation();
  const [available, setAvailable] = useState(true);
  const [username, setUsername] = useState("");
  const [created, setCreated] = useState(false);

  const { control, handleSubmit, watch } = useForm();
  const purpose = watch("Purpose");
  const budget = watch("Budget");
  const time = watch("Time");
  const others = watch("Others");

  useEffect(() => {
    const getUser = async () => {
      const auth = getAuth();
      const db = getDatabase();
      const userId = auth.currentUser.uid;
      const dbRef = ref(db, `users/${userId}/username`);
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setUsername(snapshot.val());
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  });

  const onAddSchedulePressed = async () => {
    const auth = getAuth();
    const db = getDatabase();
    const userId = auth.currentUser?.uid;

    if (userId && !created) {
      const postData = {
        purpose,
        budget: available ? budget : null,
        time,
        others,
      };

      try {
        const newPostKey = push(child(ref(db), "profile")).key;
        await set(
          ref(db, `/users/${userId}/profile/schedules/${newPostKey}`),
          postData
        );
        setCreated(true);
        Alert.alert("Success", "New Schedule created successfully!");
      } catch (error) {
        console.error("Error creating Schedule:", error);
        Alert.alert("Error", "Failed to create schedule");
      }
    } else if (created) {
      const postData = {
        purpose,
        budget: available ? budget : null,
        time,
        others,
      };
      const newPostKey = push(child(ref(db), "profile")).key;
      const updates = {};
      updates[`/users/${userId}/profile/schedules/${newPostKey}`] = postData;
      update(ref(db), updates);
      Alert.alert("Success", "Updated current Schedule successfully!");
    } else {
      Alert.alert("Error", "User not authenticated");
    }
  };

  const onBackPressed = () => {
    console.warn("onBackPressed");
    navigation.navigate("AddSchedule");
  };

  const onApplicablePressed = () => {
    console.warn("onApplicablePressed");
    setAvailable(true);
  };

  const onNotApplicablePressed = () => {
    console.warn("onNotApplicablePressed");
    setAvailable(false);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={styles.title}>Add Schedule</Text>
        <Text>Purpose</Text>
        <CustomInput
          name="Purpose"
          placeholder="Purpose"
          control={control}
          rules={{ required: "Purpose is required" }}
        />
        <Text>Budget Availablity</Text>
        <View style={{ alignSelf: "flex-start", flexDirection: "row" }}>
          <CustomButton
            text="Budget Applicable"
            design="HALF"
            onPress={onApplicablePressed}
          />
          <CustomButton
            text="Budget Not-Applicable"
            design="HALF"
            onPress={onNotApplicablePressed}
          />
        </View>
        {available && (
          <>
            <Text>Budget</Text>
            <CustomInput
              name="Budget"
              placeholder="Budget"
              control={control}
              rules={{ required: "Budget is required" }}
            />
          </>
        )}
        <Text>Time</Text>
        <CustomInput
          name="Time"
          placeholder="12.00PM"
          control={control}
          keyboard="time"
        />
        <Text>Date</Text>
        <CustomInput
          name="Date"
          placeholder="12.00PM"
          control={control}
          keyboard="date"
        />
        <Text>Others</Text>
        <CustomInput name="Others" control={control} placeholder="Others" />
        <CustomButton text="Add" onPress={handleSubmit(onAddSchedulePressed)} />
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
});
