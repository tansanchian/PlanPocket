import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AddScheduleScreen from "../screens/MainApp/AddScheduleScreen";
import ScheduleForm from "../screens/MainApp/ScheduleForm";
import ChooseDateScreen from "../screens/MainApp/ChooseDateScreen";
import DateScreen from "../screens/MainApp/DateScreen";

const Stack = createNativeStackNavigator();

const Schedule = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddSchedule" component={AddScheduleScreen} />
      <Stack.Screen name="ScheduleForm" component={ScheduleForm} />
      <Stack.Screen name="ChooseDate" component={ChooseDateScreen} />
      <Stack.Screen name="DateScreen" component={DateScreen} />
    </Stack.Navigator>
  );
};

export default Schedule;
