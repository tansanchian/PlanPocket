import "react-native-gesture-handler";
import React, { useState, useEffect, useCallback } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Tabs from "./Tabs";
import ProfileScreen from "../screens/MainApp/ProfileScreen";
import CustomDrawer from "../components/CustomDrawer";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useWindowDimensions, View, ActivityIndicator } from "react-native";
import { readProfile } from "../components/Database";
import { ref, getDatabase, get, child } from "firebase/database";
import { getAuth } from "firebase/auth";
import AboutUsScreen from "../screens/MainApp/AboutUsScreen"; // Import your AboutUsScreen

const Drawers = createDrawerNavigator();
const Stack = createStackNavigator();

const Drawer = () => {
  const [username, setUsername] = useState("");
  const [imageUri, setImageUri] = useState(
    "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
  );
  const [isLoading, setIsLoading] = useState(true);
  const dimensions = useWindowDimensions();

  const fetchImage = async () => {
    const dbRef = ref(getDatabase());
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    try {
      const snapshot = await get(
        child(dbRef, `users/${userId}/Profile/imageUrl`)
      );
      if (snapshot.exists() && snapshot.val() !== "") {
        setImageUri(snapshot.val());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsername = useCallback(async () => {
    console.log("Fetching username...");
    try {
      await readProfile("username", setUsername);
      await fetchImage();
    } catch (error) {
      console.error("Error fetching username:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsername();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#735DA5" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainDrawer">
        {() => (
          <Drawers.Navigator
            drawerContent={(props) => (
              <CustomDrawer
                {...props}
                username={username}
                imageUri={imageUri}
              />
            )}
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
          </Drawers.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
    </Stack.Navigator>
  );
};

export default Drawer;
