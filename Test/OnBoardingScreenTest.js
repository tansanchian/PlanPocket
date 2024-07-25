import React, { useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { StatusBar } from "expo-status-bar";

export const OnBoardingScreenTest = ({ onDone }) => {
  const handleDone = useCallback(() => {
    if (onDone) {
      onDone();
    }
  }, [onDone]);

  const Done = ({ isLight, onPress, ...props }) => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: "#735DA5", // Fixed color value
          },
        ]}
        onPress={() => {
          onPress();
          handleDone();
        }}
        {...props}
      >
        <Text style={styles.text}>Done</Text>
      </TouchableOpacity>
    </View>
  );

  const Next = ({ isLight, onPress, ...props }) => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: "#735DA5", // Fixed color value
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
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Onboarding
        onDone={handleDone}
        showSkip={false}
        DoneButtonComponent={Done}
        NextButtonComponent={Next}
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
        pages={[
          {
            backgroundColor: "white",
            image: (
              <Image
                source={require("../assets/Logo.png")}
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
                source={require("../assets/AddScheduleScreen.jpg")}
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
                source={require("../assets/AddPurposeScreen.jpg")}
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
                source={require("../assets/SharePurposeScreen.jpg")}
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
                source={require("../assets/SettingScreen.jpg")}
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
                source={require("../assets/HomeScreen.jpg")}
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
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    paddingRight: 10,
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
  image: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
  title: {
    color: "#735DA5",
  },
  subtitle: {
    fontSize: 15,
  },
});
