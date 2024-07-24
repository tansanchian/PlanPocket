import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { database } from "../../App";
import { getAuth } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { StatusBar } from "expo-status-bar";

export const OnboardingScreen = () => {
  const navigation = useNavigation();

  const onDone = useCallback(async () => {
    const auth = getAuth();
    if (auth.currentUser) {
      await updateDoc(doc(database, "users", auth.currentUser.uid), {
        firstLoggedIn: false,
      });
    }
    navigation.navigate("Drawer");
  }, [navigation]);

  const backgroundColor = (isLight) => (isLight ? "#735DA5" : "#735DA5");
  const color = (isLight) => backgroundColor(!isLight);

  const Done = ({ isLight, onPress, ...props }) => (
    <View style={{ flex: 1, paddingRight: 10 }}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: backgroundColor(isLight),
          },
        ]}
        onPress={onPress}
        {...props}
      >
        <Text style={styles.text}>Done</Text>
      </TouchableOpacity>
    </View>
  );

  const Next = ({ isLight, onPress, ...props }) => (
    <View style={{ flex: 1, paddingRight: 10 }}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: backgroundColor(isLight),
          },
        ]}
        onPress={onPress}
        {...props}
      >
        <Text style={styles.text}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Onboarding
        onDone={onDone}
        showSkip={false}
        DoneButtonComponent={Done}
        NextButtonComponent={Next}
        titleStyles={{ color: "#735DA5" }}
        subTitleStyles={{ fontSize: 15 }}
        pages={[
          {
            backgroundColor: "white",
            image: (
              <Image
                source={require("../../assets/Logo.png")}
                style={styles.image}
              />
            ),
            title: "Welcome",
            subtitle: "Welcome to our app, let us start our journey together",
          },
          {
            backgroundColor: "white",
            image: (
              <Image
                source={require("../../assets/AddScheduleScreen.jpg")}
                style={styles.image}
              />
            ),
            title: "Create a Customized Schedule with Ease",
            subtitle: "Personalize Your Daily Plans by Adding Unique Schedules",
          },
          {
            backgroundColor: "white",
            image: (
              <Image
                source={require("../../assets/AddPurposeScreen.jpg")}
                style={styles.image}
              />
            ),
            title: "Enhance Your Schedule with Purpose",
            subtitle: "Easily Add Friends and Share Your Plans Effortlessly",
          },
          {
            backgroundColor: "white",
            image: (
              <Image
                source={require("../../assets/SharePurposeScreen.jpg")}
                style={styles.image}
              />
            ),
            title: "Connecting with Friends and Sharing Schedules",
            subtitle: "Easily Add Friends and Share Your Plans Effortlessly",
          },
          {
            backgroundColor: "white",
            image: (
              <Image
                source={require("../../assets/SettingScreen.jpg")}
                style={styles.image}
              />
            ),
            title: "Adjust Your Budget Allocation to Fit Your Needs",
            subtitle:
              "Customize Your Spending Categories for Better Financial Management in Settings",
          },
          {
            backgroundColor: "white",
            image: (
              <Image
                source={require("../../assets/HomeScreen.jpg")}
                style={styles.image}
              />
            ),
            title: "Stay Within Budget with Real-Time Alerts",
            subtitle: "Visual Indicators to Help You Manage Your Spending",
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
  button: {
    marginVertical: 10,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 25,
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});
