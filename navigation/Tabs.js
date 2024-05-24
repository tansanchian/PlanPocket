import { View, Text } from "react-native";
import React, { Fragment } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/MainApp/HomeScreen";
import FriendScreen from "../screens/MainApp/FriendScreen";
import MessagerScreen from "../screens/MainApp/MessagerScreen";
import TimeTableScreen from "../screens/MainApp/TimeTableScreen";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Friend" component={FriendScreen} />
      <Tab.Screen name="Messager" component={MessagerScreen} />
      <Tab.Screen name="TimeTable" component={TimeTableScreen} />
    </Tab.Navigator>
  );
};

export default Tabs;
