import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import {
  readCurrentDateDatabase,
  readProfile,
} from "../../components/Database";

const HomeScreen2 = () => {
  const navigation = useNavigation();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [username, setUsername] = useState("");

  const loadItems = useCallback(async () => {
    try {
      await readProfile("username", setUsername);
      const data = await readCurrentDateDatabase();
      setCurrentEvent(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setCurrentEvent(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        loadItems();
      }, 1000);

      return () => clearTimeout(timer);
    }, [loadItems])
  );

  const onNextPressed = () => {
    navigation.navigate("HomeScreen");
  };

  const onCalendarPressed = () => {
    navigation.navigate("Timetable");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Home" />
      <View style={styles.dashboard}>
        <View style={styles.name}>
          <Text style={styles.nameText}>Good Day {username}</Text>
        </View>
        {!currentEvent ? (
          <View style={styles.date}>
            <View style={{ paddingRight: 20 }}>
              <TouchableOpacity onPress={onCalendarPressed}>
                <Avatar.Icon icon="calendar" size={40} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.dateText}>You have no current event</Text>
            </View>
          </View>
        ) : (
          <View style={styles.date}>
            <View style={{ paddingRight: 20 }}>
              <TouchableOpacity onPress={onCalendarPressed}>
                <Avatar.Icon icon="calendar" size={40} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.dateText}>Your next event is on</Text>
              <Text style={styles.dateText}>{currentEvent}</Text>
            </View>
          </View>
        )}
        <View style={styles.main}>
          <View style={styles.card}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#FFEFE3" }]}
            >
              <FontAwesome5 name="wallet" size={24} color="orange" />
            </View>
            <Text style={styles.cardText}>Current Spend</Text>
            <Text style={styles.amount}>???</Text>
          </View>
          <View style={styles.card}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#E3F7FF" }]}
            >
              <FontAwesome5 name="rocket" size={24} color="skyblue" />
            </View>
            <Text style={styles.cardText}>Spend to goals</Text>
            <Text style={styles.amount}>???</Text>
          </View>
          <View style={styles.card}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#FDE3FF" }]}
            >
              <FontAwesome5 name="handshake" size={24} color="pink" />
            </View>
            <Text style={styles.cardText}>Consult Spend</Text>
            <Text style={styles.amount}>???</Text>
          </View>
          <View style={[styles.card, { marginBottom: 0 }]}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#E3FFE3" }]}
            >
              <FontAwesome5 name="tags" size={24} color="lightgreen" />
            </View>
            <Text style={styles.cardText}>If Category</Text>
            <Text style={styles.amount}>???</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  dashboard: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#F0F0F5",
  },
  budget: {
    flex: 0.1,
    justifyContent: "flex-start",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#6a1b9a",
  },
  date: {
    flex: 1,
    maxHeight: 65,
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#735DA5",
  },
  name: {
    flex: 1,
    maxHeight: 60,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#735DA5",
  },
  dateText: {
    fontSize: 20,
    color: "white",
  },
  nameText: {
    fontSize: 20,
    color: "white",
  },
  main: {
    flex: 0.8,
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingVertical: 50,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    height: 150,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
