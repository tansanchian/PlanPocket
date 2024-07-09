import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreenNav from "./HomeScreenNav";
import TimeTableNav from "./TimeTableNav";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Schedule from "./Schedule";
import { Platform, View } from "react-native";
import MessengerNav from "./MessengerNav";
import FriendScreen from "../screens/MainApp/Friend/FriendScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "";

  return {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarActiveTintColor: "#735DA5",
    tabBarInactiveTintColor: "#D3C5E5",
    tabBarStyle: {
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      elevation: 0,
      height: Platform.OS === "ios" ? 90 : 60,
      backgroundColor: "white",
      display: routeName === "Messenger" ? "none" : "flex",
    },
  };
};
const Tabs = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreenNav}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name="TimeTable"
        component={TimeTableNav}
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
      <Tab.Screen
        name="Add"
        component={Schedule}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#735DA5",
                  height: Platform.OS === "ios" ? 60 : 50,
                  width: Platform.OS === "ios" ? 60 : 50,
                  borderRadius: Platform.OS === "ios" ? 35 : 30,
                  borderWidth: 2,
                  borderColor: "white",
                }}
              >
                <MaterialCommunityIcons name="plus" color="white" size={size} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={MessengerNav}
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
