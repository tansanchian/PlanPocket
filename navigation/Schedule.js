import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AddScheduleScreen from "../screens/MainApp/AddScheduleScreen";
import ScheduleForm from "../screens/MainApp/ScheduleForm";

const Stack = createNativeStackNavigator();

const Schedule = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddSchedule" component={AddScheduleScreen} />
      <Stack.Screen name="ScheduleForm" component={ScheduleForm} />
    </Stack.Navigator>
  );
};

export default Schedule;
