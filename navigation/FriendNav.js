import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import FriendScreen from "../screens/MainApp/Friend/FriendScreen";
import AddFriendSearchList from "../screens/MainApp/Friend/AddFriendSearchList";

const Stack = createNativeStackNavigator();

const FriendNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="FriendScreen"
    >
      <Stack.Screen name="FriendScreen" component={FriendScreen} />
      <Stack.Screen
        name="AddFriendSearchList"
        component={AddFriendSearchList}
      />
    </Stack.Navigator>
  );
};

export default FriendNav;
