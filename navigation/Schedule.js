import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AddScheduleScreen from "../screens/MainApp/AddScheduleScreen";
import ChooseDateScreen from "../screens/MainApp/ChooseDateScreen";
import DateScreen from "../screens/MainApp/DateScreen";
import WeekScreen from "../screens/MainApp/WeekScreen";
import MonthScreen from "../screens/MainApp/MonthScreen";

const Stack = createNativeStackNavigator();

const Schedule = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddSchedule" component={AddScheduleScreen} />
      <Stack.Screen name="ChooseDate" component={ChooseDateScreen} />
      <Stack.Screen name="DateScreen" component={DateScreen} />
      <Stack.Screen name="WeekScreen" component={WeekScreen} />
      <Stack.Screen name="MonthScreen" component={MonthScreen} />
    </Stack.Navigator>
  );
};

export default Schedule;
