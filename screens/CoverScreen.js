import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/global";
import { StatusBar } from "expo-status-bar";

const CoverScreen = () => {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  const onPressLogin = () => {
    navigation.navigate("SignIn");
  };
  const onPressRegister = () => {
    navigation.navigate("SignUp");
  };
  return (
    <ScrollView
      contentContainerStyle={{ minHeight: "100%" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Image
          source={require("../assets/Logo.png")}
          style={{ resizeMode: "contain", height: 450 }}
        />
        <View
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <Image
            source={require("../assets/Logo.png")}
            style={styles.illustration}
          />
          <Text style={{ textAlignVertical: "bottom", fontSize: 20 }}>
            <Text style={{ fontWeight: "bold" }}>Plan</Text>Pocket
          </Text>
        </View>
        <Text style={styles.title}>Everything you need is in one place</Text>
        <Text style={styles.description}>
          Manage both your time and finances effectively while ensuring your
          activties within your budget!
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={onPressLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={onPressRegister}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CoverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3eef6",
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  illustration: {
    width: 50,
    height: 50,
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 10,
  },
  description: {
    fontSize: 20,
    alignSelf: "flex-start",
    textAlign: "left",
    marginVertical: 10,
    color: "#555",
  },
  loginButton: {
    backgroundColor: "#735DA5",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    borderColor: "#D3C5E5",
    backgroundColor: "#D3C5E5",
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});