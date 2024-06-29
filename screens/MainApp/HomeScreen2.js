import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5 } from "@expo/vector-icons";
import { todayString } from "react-native-calendars/src/expandableCalendar/commons";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

const HomeScreen2 = () => {
  const navigation = useNavigation();
  const onNextPressed = () => {
    navigation.navigate("HomeScreen");
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Home" />
      <View style={styles.dashboard}>
        <View style={styles.budget}>
          <Text style={styles.title}>Title</Text>
        </View>
        <View style={styles.date}>
          <Text style={styles.dateText}>
            {new Date().toJSON().slice(0, 10).replace(/-/g, "/")}
          </Text>
        </View>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6a1b9a",
    marginHorizontal: -100,
  },
  dateText: {
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
