import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";
import { Logout } from "../../components/Logout";

const ProfileScreen = () => {
  return (
    <View style={styles.form}>
      <Logout />
      <Text style={styles.text}>Welcome to ProfileScreen</Text>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    backgroundColor: "pink",
    padding: 20,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
});
