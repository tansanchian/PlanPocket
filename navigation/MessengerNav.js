import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import MessengerScreen from "../screens/MainApp/Messenger/MessengerScreen";
import UserList from "../screens/MainApp/Messenger/UserList";

const Stack = createNativeStackNavigator();

const MessengerNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="UserList"
    >
      <Stack.Screen name="UserList" component={UserList} />
      <Stack.Screen name="Messenger" component={MessengerScreen} />
    </Stack.Navigator>
  );
};

export default MessengerNav;
