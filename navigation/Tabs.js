import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/MainApp/HomeScreen";
import FriendScreen from "../screens/MainApp/FriendScreen";
import MessagerScreen from "../screens/MainApp/MessagerScreen";
import TimeTableScreen from "../screens/MainApp/TimeTableScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AddScheduleScreen from "../screens/MainApp/AddScheduleScreen";
import Schedule from "./Schedule";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelPosition: "left",
        tabBarShowLabel: true,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TimeTable"
        component={TimeTableScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-clock"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen name="Add" component={Schedule} />
      <Tab.Screen
        name="Inbox"
        component={MessagerScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Friend"
        component={FriendScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
