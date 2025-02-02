import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Schedule from "../screens/MainApp/ScheduleForm";
import TimeTableScreen from "../screens/MainApp/TimeTableScreen";

const Stack = createNativeStackNavigator();

const TimeTableNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TimeTableScreen" component={TimeTableScreen} />
      <Stack.Screen name="ScheduleForm" component={Schedule} />
    </Stack.Navigator>
  );
};

export default TimeTableNav;