import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import MessengerScreen from "../screens/MainApp/Messenger/MessengerScreen";
import ChatList from "../screens/MainApp/Messenger/ChatList";
import ChatItem from "../screens/MainApp/Messenger/ChatItem";

const Stack = createNativeStackNavigator();

const MessengerNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ChatList"
    >
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="Messenger" component={MessengerScreen} />
      <Stack.Screen name="ChatItem" component={ChatItem} />
    </Stack.Navigator>
  );
};

export default MessengerNav;
