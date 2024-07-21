import React, { useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPassword from "../screens/ForgotPassworScreen";
import CoverScreen from "../screens/CoverScreen";
import Drawer from "./Drawer";
import { AuthContext } from "../components/AuthContext";
import { OnboardingScreen } from "../screens/MainApp/OnboardingScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { isLoading, userToken, firstLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    console.log(firstLoggedIn)
  })
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
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
          {firstLoggedIn ? (
            <>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Drawer" component={Drawer} />
            </>
          ) : (
            <Stack.Screen name="Drawer" component={Drawer} />
          )}
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
