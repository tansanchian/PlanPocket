import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import {
  readCurrentDateDatabase,
  readProfile,
  readScheduleDatabase,
  readScheduleExpenses,
} from "../../components/Database";
import Modal from "react-native-modal";

const HomeScreen2 = () => {
  const navigation = useNavigation();
  const [purpose, setPurpose] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState(null);
  const [scheduleArray, setScheduleArray] = useState([]);
  const [dashboardSelect, setDashboardSelect] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  const parseTime = (x) => {
    const convertTo12HourFormat = (timeString) => {
      const [hours, minutes] = timeString.split(":");
      const dateObj = new Date();
      dateObj.setHours(hours);
      dateObj.setMinutes(minutes);
      return dateObj.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    };
    return convertTo12HourFormat(x.split("T")[1].substring(0, 5));
  };

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const loadItems = useCallback(async () => {
    try {
      await readProfile("username", setUsername);
      const purposeData = await readCurrentDateDatabase();
      setPurpose(purposeData);

      const scheduleData = await readScheduleDatabase();
      setScheduleLoading(true);
      if (!scheduleData) {
        setScheduleArray([]);
      } else {
        const scheduleEntries = Object.entries(scheduleData);
        setScheduleArray(scheduleEntries);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setIsLoading(false);
      setScheduleLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      console.log("dashboard", dashboardSelect);
      if (!dashboardSelect) return;
      try {
        const expensesData = await readScheduleExpenses(
          String(dashboardSelect)
        );
        setExpenses(expensesData);
        console.log("ExpensesData", expensesData);
      } catch (error) {
        console.error("Error fetching expenses:", error.message);
      }
    };
    fetchExpenses();
  }, [dashboardSelect, scheduleArray]);

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
    if (scheduleArray.length > 0 && firstLoad) {
      setDashboardSelect(String(scheduleArray[0][0]));
      setFirstLoad(false);
    }
    if (scheduleArray.length > 0) {
      setDashboardSelect(String(scheduleArray[0][0]));
    } else {
      setDashboardSelect("");
    }
  }, [scheduleArray, firstLoad, dashboardSelect]);

  const onNextPressed = () => {
    navigation.navigate("HomeScreen");
  };

  const onCalendarPressed = () => {
    navigation.navigate("Timetable");
  };

  const loading = () => {
    <View
      style={[
        styles.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <ActivityIndicator size="large" color="#735DA5" />
    </View>;
  };
  if (isLoading) {
    return loading;
  }

  const renderItem = ({ item }) => {
    if (!item) {
      return null;
    }
    const values = item[1];
    const id = String(item[0]);
    const isSelected = dashboardSelect === item[0];
    return (
      <TouchableOpacity
        style={[
          styles.cardContainer,
          isSelected && { backgroundColor: "#E0E0E0" },
        ]}
        onPress={() => setDashboardSelect(id)}
      >
        <Text>{values.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Home" />
      <View style={styles.dashboard}>
        <View style={styles.name}>
          <Text style={styles.nameText}>Good Day {username}</Text>
        </View>
        {!purpose ? (
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
              <Text style={styles.dateText}>
                {parseDate(purpose.eventDate)}{" "}
                {parseTime(purpose.purpose.fromTime)} to{" "}
                {parseTime(purpose.purpose.toTime)}
              </Text>
            </View>
          </View>
        )}
        <View>
          {scheduleLoading ? (
            loading
          ) : expenses ? (
            <View>
              <FlatList
                data={scheduleArray}
                keyExtractor={(item) => item[0]}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  alignItems: "center",
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
              />
              <View style={styles.main}>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.card}
                >
                  <Modal isVisible={isModalVisible}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalText}>L</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Number of days"
                        keyboardType="numeric"
                      />
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button}>
                          <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.button, styles.cancelButton]}
                          onPress={() => setModalVisible(false)}
                        >
                          <Text
                            style={[styles.buttonText, styles.cancelButtonText]}
                          >
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>

                  <View
                    style={[styles.iconContainer, { backgroundColor: "white" }]}
                  >
                    <FontAwesome5 name="wallet" size={24} color="#41afaa" />
                  </View>
                  <Text style={styles.cardText}>Entertainment & Leisure</Text>
                  <Text style={styles.amount}>
                    {`$ ${
                      expenses?.["Entertainment & Leisure"]?.["costs"] ?? "0"
                    }`}
                  </Text>
                </TouchableOpacity>
                <View style={styles.card}>
                  <View
                    style={[styles.iconContainer, { backgroundColor: "white" }]}
                  >
                    <FontAwesome5 name="rocket" size={24} color="#466eb4" />
                  </View>
                  <Text style={styles.cardText}>Transportation</Text>
                  <Text style={styles.amount}>
                    {`$ ${expenses?.["Transportation"]?.["costs"] ?? "0"}`}
                  </Text>
                </View>
                <View style={styles.card}>
                  <View
                    style={[styles.iconContainer, { backgroundColor: "white" }]}
                  >
                    <FontAwesome5 name="utensils" size={24} color="#00a0e1" />
                  </View>
                  <Text style={styles.cardText}>Dining</Text>
                  <Text style={styles.amount}>
                    {`$ ${expenses?.["mealBudget"]?.["costs"] ?? "0"}`}
                  </Text>
                </View>
                <View style={[styles.card, { marginBottom: 0 }]}>
                  <View
                    style={[styles.iconContainer, { backgroundColor: "white" }]}
                  >
                    <FontAwesome5
                      name="shopping-cart"
                      size={24}
                      color="#e6a532"
                    />
                  </View>
                  <Text style={styles.cardText}>Shopping</Text>
                  <Text style={styles.amount}>
                    {`$ ${expenses?.["Shopping"]?.["costs"] ?? "0"}`}
                  </Text>
                </View>
                <View style={styles.card}>
                  <View
                    style={[styles.iconContainer, { backgroundColor: "white" }]}
                  >
                    <FontAwesome5 name="handshake" size={24} color="#d7642c" />
                  </View>
                  <Text style={styles.cardText}>Bill, Utilities & Taxes</Text>
                  <Text style={styles.amount}>
                    {`$ ${
                      expenses?.["Bill, Utilities & Taxes"]?.["costs"] ?? "0"
                    }`}
                  </Text>
                </View>
                <View style={[styles.card, { marginBottom: 0 }]}>
                  <View
                    style={[styles.iconContainer, { backgroundColor: "white" }]}
                  >
                    <FontAwesome5 name="tags" size={24} color="#af4b91" />
                  </View>
                  <Text style={styles.cardText}>Uncategorized</Text>
                  <Text style={styles.amount}>
                    {`$ ${expenses?.["Uncategorized"]?.["costs"] ?? "0"}`}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noExpensesContainer}>
              <Image source={require("../../assets/emptyHome.png")} />
              <Text style={{ marginTop: 15, fontWeight: "bold", fontSize: 25 }}>
                WOO!
              </Text>
              <Text style={{ marginTop: 10, fontSize: 20 }}>
                Nothing Here, But Me
              </Text>
              <Text style={{ marginTop: 10, fontSize: 20, color: "grey" }}>
                You dont't have anything planned.
              </Text>
            </View>
          )}
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
  cardContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noExpensesContainer: {
    paddingTop: 130,
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});