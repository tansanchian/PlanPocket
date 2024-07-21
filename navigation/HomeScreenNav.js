import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen2 from "../screens/MainApp/HomeScreen2";
import HomeScreen from "../screens/MainApp/HomeScreen";

const Stack = createNativeStackNavigator();

const HomeScreenNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeScreen2"
    >
      <Stack.Screen name="HomeScreen2" component={HomeScreen2} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default HomeScreenNav;
