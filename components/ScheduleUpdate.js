import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  push,
  update,
  child,
  get,
  set,
} from "firebase/database";
import { getAuth } from "firebase/auth";

const ScheduleUpdate = () => {
  const [username, setUsername] = useState("");
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const getUser = async () => {
      const userId = auth.currentUser.uid;
      const dbRef = ref(db, `users/${userId}/username`);
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setUsername(snapshot.val());
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const createProfile = async () => {
      const postData = {
        Country: "Singapore",
        Location: "Ang Mo Kio",
      };

      const userId = auth.currentUser.uid;
      try {
        await set(ref(db, `users/${userId}/profile`), postData);
        console.log("Profile created successfully!");
      } catch (error) {
        console.error("Error creating profile:", error);
      }
    };

    getUser();
    createProfile();
  }, []);

  return (
    <View style={styles.form}>
      <Text style={styles.text}>Welcome to {username}</Text>
    </View>
  );
};

export default ScheduleUpdate;

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
