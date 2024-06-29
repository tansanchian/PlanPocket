import "react-native-gesture-handler";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Tabs from "./Tabs";
import ProfileScreen from "../screens/MainApp/ProfileScreen";
import CustomDrawer from "../components/CustomDrawer";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SettingScreen from "../screens/MainApp/SettingScreen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { readProfile } from "../components/Database";

const Drawers = createDrawerNavigator();

const Drawer = () => {
  const [username, setUsername] = useState("");
  const dimensions = useWindowDimensions();
  const fetchUsername = async () => {
    await readProfile("username", setUsername);
  };
  useEffect(() => {
    fetchUsername();
  }, []);

  return (
    <Drawers.Navigator
      drawerContent={(props) => <CustomDrawer {...props} username={username} />}
      screenOptions={{
        drawerStyle: {
          width: dimensions.width * 0.7,
        },
        swipeEdgeWidth: dimensions.width * 0.5,
        headerShown: false,
        drawerLabelStyle: { marginLeft: -25 },
        drawerActiveBackgroundColor: "#D3C5E5",
        drawerActiveTintColor: "#735DA5",
      }}
    >
      <Drawers.Screen
        name="Main"
        component={Tabs}
        options={{
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="chalkboard" color={color} size={20} />
          ),
        }}
      />
      <Drawers.Screen
        name="My Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <FontAwesome name="user-circle-o" color={color} size={20} />
          ),
        }}
      />
      <Drawers.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          drawerIcon: ({ color }) => (
            <AntDesign name="setting" color={color} size={20} />
          ),
        }}
      />
    </Drawers.Navigator>
  );
};

export default Drawer;
