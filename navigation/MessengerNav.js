import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import MessengerScreen from "../screens/MainApp/Messenger/MessengerScreen";
import ChatList from "../screens/MainApp/Messenger/ChatList";
import ChatItem from "../screens/MainApp/Messenger/ChatItem";
import SearchList from "../screens/MainApp/Messenger/SearchList";
import ScheduleList from "../screens/MainApp/Messenger/ScheduleList";
import SharedCustomDateScreen from "../screens/MainApp/Messenger/SharedCustomDateScreen";
import SharedPurposeDirectlyIfNull from "../screens/MainApp/Messenger/SharedPurposeDirectlyIfNull";

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
      <Stack.Screen name="SearchList" component={SearchList} />
      <Stack.Screen name="ScheduleList" component={ScheduleList} />
      <Stack.Screen
        name="SharedPurposeDirectlyIfNull"
        component={SharedPurposeDirectlyIfNull}
      />
      <Stack.Screen
        name="SharedCustomDateScreen"
        component={SharedCustomDateScreen}
      />
    </Stack.Navigator>
  );
};

export default MessengerNav;
