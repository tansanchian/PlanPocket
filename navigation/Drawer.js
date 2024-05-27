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
import { getDatabase, ref, child, get } from "firebase/database";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

const Drawers = createDrawerNavigator();

const Drawer = () => {
  const [username, setUsername] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
    if (user) {
      const fetchUsername = async () => {
        const dbRef = ref(getDatabase());
        try {
          const snapshot = await get(
            child(dbRef, `users/${user.uid}/username`)
          );
          if (snapshot.exists()) {
            setUsername(snapshot.val());
          } else {
            console.log("No data available");
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUsername();
    }
  }, [user]);

  return (
    <Drawers.Navigator
      drawerContent={(props) => <CustomDrawer {...props} username={username} />}
      screenOptions={{
        swipeEdgeWidth: 1080,
        headerShown: false,
        drawerLabelStyle: { marginLeft: -25 },
        drawerActiveBackgroundColor: "purple",
        drawerActiveTintColor: "#fff",
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
        name="Profile"
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
