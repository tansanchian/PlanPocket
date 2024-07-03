import { View, Text, StyleSheet, Button, Alert, TextInput } from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";

const FriendScreen = () => {
  const [friendUsername, setFriendUsername] = useState("");

  const handleAddFriend = () => {
    if (friendUsername.trim()) {
      // Replace this with your logic to add a friend, e.g., API call
      Alert.alert("Success", `Friend "${friendUsername}" added!`);
      setFriendUsername("");
      // Optionally navigate back or to a friend's list
      // navigation.goBack();
    } else {
      Alert.alert("Error", "Please enter a valid username.");
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Friends" />
      <View style={styles.internalContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter friend's username"
          value={friendUsername}
          onChangeText={setFriendUsername}
        />
        <Button title="Add Friend" onPress={handleAddFriend} />
        <Text style={styles.title}>Add a Friend</Text>
      </View>
    </View>
  );
};

export default FriendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  internalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3eef6",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    justifyContent: "center",
    margin: 10,
  },
});
