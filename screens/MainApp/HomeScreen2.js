import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import {
  readCurrentDateDatabase,
  readProfile,
  readScheduleExpenses,
} from "../../components/Database";

const HomeScreen2 = () => {
  const navigation = useNavigation();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState(null);

  const loadItems = useCallback(async () => {
    try {
      await readProfile("username", setUsername);
      const data = await readCurrentDateDatabase();
      const temp = await readScheduleExpenses();
      setExpenses(temp);
      setCurrentEvent(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setCurrentEvent(null);
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    return () => setIsLoading(true);
  }, []);

  useEffect(() => {
    console.log(expenses); // Log expenses whenever it changes
  }, [expenses]);

  const onNextPressed = () => {
    navigation.navigate("HomeScreen");
  };

  const onCalendarPressed = () => {
    navigation.navigate("Timetable");
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#735DA5" />
      </View>
    );
  }

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
            <View style={[styles.iconContainer, { backgroundColor: "white" }]}>
              <FontAwesome5 name="wallet" size={24} color="#41afaa" />
            </View>
            <Text style={styles.cardText}>Entertainment & Leisure</Text>
            <Text style={styles.amount}>
              {`$${expenses?.["Entertainment & Leisure"]?.["costs"] ?? "N/A"}`}
            </Text>
          </View>
          <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: "white" }]}>
              <FontAwesome5 name="rocket" size={24} color="#466eb4" />
            </View>
            <Text style={styles.cardText}>Transportation</Text>
            <Text style={styles.amount}>
              {`$${expenses?.["Transportation"]?.["costs"] ?? "N/A"}`}
            </Text>
          </View>
          <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: "white" }]}>
              <FontAwesome5 name="utensils" size={24} color="#00a0e1" />
            </View>
            <Text style={styles.cardText}>Dining</Text>
            <Text style={styles.amount}>
              {`$${expenses?.["mealBudget"]?.["costs"] ?? "N/A"}`}
            </Text>
          </View>
          <View style={[styles.card, { marginBottom: 0 }]}>
            <View style={[styles.iconContainer, { backgroundColor: "white" }]}>
              <FontAwesome5 name="shopping-cart" size={24} color="#e6a532" />
            </View>
            <Text style={styles.cardText}>Shopping</Text>
            <Text style={styles.amount}>
              {`$${expenses?.["Shopping"]?.["costs"] ?? "N/A"}`}
            </Text>
          </View>
          <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: "white" }]}>
              <FontAwesome5 name="handshake" size={24} color="#d7642c" />
            </View>
            <Text style={styles.cardText}>Bill, Utilities & Taxes</Text>
            <Text style={styles.amount}>
              {`$${expenses?.["Bill, Utilities & Taxes"]?.["costs"] ?? "N/A"}`}
            </Text>
          </View>
          <View style={[styles.card, { marginBottom: 0 }]}>
            <View style={[styles.iconContainer, { backgroundColor: "white" }]}>
              <FontAwesome5 name="tags" size={24} color="#af4b91" />
            </View>
            <Text style={styles.cardText}>Uncategorized</Text>
            <Text style={styles.amount}>
              {`$${expenses?.["Uncategorized"]?.["costs"] ?? "N/A"}`}
            </Text>
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
    paddingVertical: 10,
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
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
