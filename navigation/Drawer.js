import { createDrawerNavigator } from "@react-navigation/drawer";
import Tabs from "./Tabs";
import ProfileScreen from "../screens/MainApp/ProfileScreen";
import { Text } from "react-native";

const Drawers = createDrawerNavigator();

const Drawer = () => {
  return (
    <Drawers.Navigator>
      <Drawers.Screen
        name="Tabs"
        component={Tabs}
        options={{
          headerShown: false,
        }}
      />
      <Drawers.Screen name="Profile" component={ProfileScreen} />
    </Drawers.Navigator>
  );
};

export default Drawer;
