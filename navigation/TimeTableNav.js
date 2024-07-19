import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Schedule from "../screens/MainApp/ScheduleForm";
import Timetable from "../screens/MainApp/TimeTableScreen";
import AddScheduleScreen from "../screens/MainApp/AddScheduleScreen";
import HomeScreen2 from "../screens/MainApp/HomeScreen2";

const Stack = createNativeStackNavigator();

const TimeTableNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Timetable" component={Timetable} />
      <Stack.Screen name="ScheduleForm" component={Schedule} />
      <Stack.Screen name="AddScheduleScreen" component={AddScheduleScreen} />
      <Stack.Screen name="HomeScreen2" component={HomeScreen2} />
    </Stack.Navigator>
  );
};

export default TimeTableNav;
