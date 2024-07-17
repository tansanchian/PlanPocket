import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeScreenHeader from "./HomeScreenHeader";

const AboutUsScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="dark" />
      <HomeScreenHeader title="About Us" />
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require("../../assets/Logo.png")} style={styles.logo} />
        <Text style={styles.title}>About Us</Text>
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>
            Welcome to our application. We are BingBong from NUS! Thank you for
            spending your time on our app.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f3eef6",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#735DA5",
  },
  paragraphContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderColor: "#735DA5",
    borderWidth: 1,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: "100%",
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
});
