import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Button,
  Platform,
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
import Donut from "../../components/Donut";
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";

const HomeScreen2 = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const [purpose, setPurpose] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState(null);
  const [scheduleArray, setScheduleArray] = useState([]);
  const [dashboardSelect, setDashboardSelect] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const getIcon = (selectedCategory) => {
    switch (selectedCategory) {
      case "Entertainment & Leisure":
        return "wallet";
      case "Transportation":
        return "rocket";
      case "Dining":
        return "utensils";
      case "Shopping":
        return "shopping-cart";
      case "Bill, Utilities & Taxes":
        return "handshake";
      case "Uncategorized":
        return "tags";
    }
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

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const openBottomSheet = (category) => {
    setSelectedCategory(category);
    setBottomSheetVisible(true);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1);
    }
  };
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
    if (scheduleArray.length == 1) {
      setDashboardSelect(String(scheduleArray[0][0]));
    }
  }, [scheduleArray, firstLoad, dashboardSelect]);

  const onNextPressed = () => {
    navigation.navigate("HomeScreen", { expenses });
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

  const getTotalCosts = (spendings) => {
    return Object.values(spendings).reduce((total, category) => {
      if (category && category.costs) {
        return total + category.costs;
      }
      return total;
    }, 0);
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
            loading()
          ) : expenses ? (
            <View>
              <FlatList
                data={scheduleArray}
                keyExtractor={(item) => item[0]}
                contentContainerStyle={{
                  alignItems: "center",
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
              />
              <View style={styles.row}>
                <Text>Total Spendings: ${getTotalCosts(expenses)}</Text>
                <Button title="View" onPress={onNextPressed} />
              </View>
              <View style={styles.main}>
                <TouchableOpacity
                  onPress={() => openBottomSheet("Entertainment & Leisure")}
                  style={styles.card}
                >
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
                <TouchableOpacity
                  onPress={() => openBottomSheet("Transportation")}
                  style={styles.card}
                >
                  <View
                    style={[styles.iconContainer, { backgroundColor: "white" }]}
                  >
                    <FontAwesome5 name="rocket" size={24} color="#466eb4" />
                  </View>
                  <Text style={styles.cardText}>Transportation</Text>
                  <Text style={styles.amount}>
                    {`$ ${expenses?.["Transportation"]?.["costs"] ?? "0"}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openBottomSheet("Dining")}
                  style={styles.card}
                >
                  <View
                    style={[styles.iconContainer, { backgroundColor: "white" }]}
                  >
                    <FontAwesome5 name="utensils" size={24} color="#00a0e1" />
                  </View>
                  <Text style={styles.cardText}>Dining</Text>
                  <Text style={styles.amount}>
                    {`$ ${expenses?.["Dining"]?.["costs"] ?? "0"}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openBottomSheet("Shopping")}
                  style={[styles.card, { marginBottom: 0 }]}
                >
                  <View
                    style={[styles.iconContainer, { backgroundColor: "white" }]}
                  >
                    <FontAwesome5
                      name="shopping-cart"
                      size={24}
                      color="#fbc02d"
                    />
                  </View>
                  <Text style={styles.cardText}>Shopping</Text>
                  <Text style={styles.amount}>
                    {`$ ${expenses?.["Shopping"]?.["costs"] ?? "0"}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openBottomSheet("Bill, Utilities & Taxes")}
                  style={[styles.card, { marginBottom: 0 }]}
                >
                  <View
                    style={[styles.iconContainer, { backgroundColor: "white" }]}
                  >
                    <FontAwesome5 name="handshake" size={24} color="#3ec191" />
                  </View>
                  <Text style={styles.cardText}>Bill, Utilities & Taxes</Text>
                  <Text style={styles.amount}>
                    {`$ ${
                      expenses?.["Bill, Utilities & Taxes"]?.["costs"] ?? "0"
                    }`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openBottomSheet("Uncategorized")}
                  style={[styles.card, { marginBottom: 0 }]}
                >
                  <View
                    style={[styles.iconContainer, { backgroundColor: "white" }]}
                  >
                    <FontAwesome5 name="tags" size={24} color="#af4b91" />
                  </View>
                  <Text style={styles.cardText}>Uncategorized</Text>
                  <Text style={styles.amount}>
                    {`$ ${expenses?.["Uncategorized"]?.["costs"] ?? "0"}`}
                  </Text>
                </TouchableOpacity>
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

      {isBottomSheetVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={["25", "40", "90"]}
          backgroundStyle={{ backgroundColor: "#f3eef6" }}
          onChange={handleSheetChanges}
          enablePanDownToClose
        >
          <BottomSheetView
            style={{ flex: 1, alignItems: "center", paddingHorizontal: 15 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                marginBottom: 20,
              }}
            >
              {selectedCategory}
            </Text>

            {expenses && expenses[selectedCategory] ? (
              <View>
                <View style={styles.row}>
                  <Donut item={expenses[selectedCategory]} />
                </View>
                <Text style={styles.subtitle}>Purposes:</Text>

                <BottomSheetFlatList
                  data={Object.entries(expenses[selectedCategory]).filter(
                    (item) => item[0] !== "costs"
                  )}
                  keyExtractor={(item) => {
                    item[0];
                  }}
                  renderItem={({ item }) => (
                    <View>
                      <View style={styles.historyItem}>
                        <View style={styles.historyIcon}>
                          <FontAwesome5
                            name={getIcon(selectedCategory)}
                            size={24}
                            color="black"
                          />
                          <Text style={styles.historyText}>{item[0]} </Text>
                        </View>
                        <Text style={styles.historyText}>
                          ${item[1].subcosts}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            ) : (
              <Text>No items found for {selectedCategory}.</Text>
            )}
          </BottomSheetView>
        </BottomSheet>
      )}
    </View>
  );
};

export default HomeScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: Platform.OS === "ios" ? 90 : 60,
  },
  dashboard: {
    padding: 20,
  },
  name: {
    paddingVertical: 10,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#6a1b9a",
  },
  date: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 16,
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
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyText: {
    color: "#101318",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  historyItem: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  historyIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
