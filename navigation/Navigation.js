import React, { useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPassword from "../screens/ForgotPassworScreen";
import CoverScreen from "../screens/CoverScreen";
import Drawer from "./Drawer";
import { AuthContext } from "../components/AuthContext";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size={"larger"} />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {userToken === null ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Cover" component={CoverScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Drawer" component={Drawer} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
