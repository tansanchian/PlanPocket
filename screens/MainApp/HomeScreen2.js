import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import { readCurrentDateDatabase } from "../../components/Database";

const HomeScreen2 = () => {
  const navigation = useNavigation();
  const [currentEvent, setCurrentEvent] = useState(null);

  const loadItems = useCallback(async () => {
    try {
      const data = await readCurrentDateDatabase();
      setCurrentEvent(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setCurrentEvent(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems();
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
        <View style={styles.budget}>
          <Text style={styles.title}>Title</Text>
        </View>
        {!currentEvent ? (
          <View style={styles.date}>
            <View style={{ padding: 20 }}>
              <TouchableOpacity onPress={onCalendarPressed}>
                <Avatar.Icon icon="calendar" size={40} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.dateText}>Your have no event</Text>
              <Text style={styles.dateText}>{currentEvent}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.date}>
            <View style={{ padding: 20 }}>
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
        <CustomButton text="Next" onPress={onNextPressed} />
        <View style={styles.main}>
          <View style={styles.card}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#FFEFE3" }]}
            >
              <FontAwesome5 name="wallet" size={24} color="orange" />
            </View>
            <Text style={styles.cardText}>Current Spend</Text>
            <Text style={styles.amount}>$3463</Text>
          </View>
          <View style={styles.card}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#E3F7FF" }]}
            >
              <FontAwesome5 name="rocket" size={24} color="skyblue" />
            </View>
            <Text style={styles.cardText}>Spend to goals</Text>
            <Text style={styles.amount}>$5463</Text>
          </View>
          <View style={styles.card}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#FDE3FF" }]}
            >
              <FontAwesome5 name="handshake" size={24} color="pink" />
            </View>
            <Text style={styles.cardText}>Consult Spend</Text>
            <Text style={styles.amount}>$1252</Text>
          </View>
          <View style={[styles.card, { marginBottom: 0 }]}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#E3FFE3" }]}
            >
              <FontAwesome5 name="tags" size={24} color="lightgreen" />
            </View>
            <Text style={styles.cardText}>If Category</Text>
            <Text style={styles.amount}>$1463</Text>
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
    padding: 20,
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
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#6a1b9a",
  },
  dateText: {
    fontSize: 17,
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
