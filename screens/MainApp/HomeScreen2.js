import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Dimensions,
  ScrollView,
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
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { ref, get, child, update } from "firebase/database";

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
  const [threshold, setThreshold] = useState({});
  const [exceedSpending, setExceedSpending] = useState(false);
  const [jump, setJump] = useState(new Date());

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

  const readThreshold = async () => {
    const dbRef = ref(getDatabase());
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    try {
      const snapshot = await get(child(dbRef, `users/${userId}/Threshold`));
      if (snapshot.exists()) {
        const curr = snapshot.val();
        console.log("Current values from DB: ", curr);
        setThreshold({
          Dining: curr["Dining"] || 0,
          "Entertainment & Leisure": curr["Entertainment & Leisure"] || 0,
          Shopping: curr["Shopping"] || 0,
          "Bill, Utilities & Taxes": curr["Bill, Utilities & Taxes"] || 0,
          Transportation: curr["Transportation"] || 0,
          Uncategorized: curr["Uncategorized"] || 0,
        });
      } else {
        console.log("No data available");
      }
    } catch (e) {
      console.error("Error reading threshold: ", e);
    }
  };

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();

    return `${month} ${day}`;
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

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
      await readThreshold();
      const purposeData = await readCurrentDateDatabase();
      setPurpose(purposeData);
      if (purposeData) {
        console.log("Purposejump", purposeData);
        setJump(formatDate(purposeData.fromTime));
      }
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

  const getTotalCosts = (spendings) => {
    return Object.values(spendings).reduce((total, category) => {
      if (category && category.costs) {
        return total + category.costs;
      }
      return total;
    }, 0);
  };

  const getBudget = (id) => {
    if (id) {
      const data = scheduleArray.filter((x) => x[0] == id);
      return data.length > 0 ? data[0][1].budget : 0;
    }
    return 0;
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!dashboardSelect) return;
      try {
        const expensesData = await readScheduleExpenses(
          String(dashboardSelect)
        );
        setExpenses(expensesData);
        if (expensesData) {
          const totalCosts = getTotalCosts(expensesData);
          const budget = getBudget(dashboardSelect);
          setExceedSpending(totalCosts > budget);
          console.log("ExpensesData", expensesData);
        } else {
          setExceedSpending(false);
        }
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
    if (scheduleArray.length === 1) {
      setDashboardSelect(String(scheduleArray[0][0]));
    }
  }, [scheduleArray, firstLoad, dashboardSelect]);

  const onNextPressed = () => {
    navigation.navigate("HomeScreen", { expenses, exceedSpending });
  };

  const onCalendarPressed = () => {
    console.log("Navigating with data:", jump);
    navigation.navigate("TimeTable", {
      screen: "TimeTableScreen",
      params: { jump: jump },
    });
  };

  const loading = () => (
    <View
      style={[
        styles.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <ActivityIndicator size="large" color="#735DA5" />
    </View>
  );

  if (isLoading) {
    return loading();
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

  const categories = [
    { name: "Entertainment & Leisure", icon: "wallet", color: "#41afaa" },
    { name: "Transportation", icon: "rocket", color: "#466eb4" },
    { name: "Dining", icon: "utensils", color: "#00a0e1" },
    { name: "Shopping", icon: "shopping-cart", color: "#fbc02d" },
    { name: "Bill, Utilities & Taxes", icon: "handshake", color: "#3ec191" },
    { name: "Uncategorized", icon: "tags", color: "#af4b91" },
  ];

  const renderCategoryItem = ({ item }) => {
    const isExceedingBudget =
      expenses &&
      expenses[item.name] &&
      expenses[item.name].costs >
        getBudget(dashboardSelect) * threshold[item.name];

    return (
      <TouchableOpacity
        onPress={() => openBottomSheet(item.name)}
        style={[styles.card, isExceedingBudget && styles.exceedingBudgetCard]}
      >
        <View style={[styles.iconContainer, { backgroundColor: "white" }]}>
          <FontAwesome5 name={item.icon} size={24} color={item.color} />
        </View>
        <Text style={styles.cardText}>{item.name}</Text>
        <Text style={styles.amount}>
          {`$ ${expenses?.[item.name]?.["costs"] ?? "0"}`}
        </Text>
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
                {parseDate(purpose.fromTime)} {parseTime(purpose.fromTime)} to{" "}
                {parseTime(purpose.toTime)}
              </Text>
            </View>
          </View>
        )}

        <View style={{ flex: 1 }}>
          {scheduleLoading ? (
            loading()
          ) : expenses ? (
            <View contentContainerStyle={{ flexGrow: 1 }}>
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
                  <View>
                    <Text
                      style={[
                        { fontWeight: "bold", fontSize: 16 },
                        exceedSpending && { color: "#cc0000" },
                      ]}
                    >
                      Total Budget: ${getBudget(dashboardSelect)}
                    </Text>
                    <Text
                      style={[
                        { fontWeight: "bold", fontSize: 16 },
                        exceedSpending && { color: "#cc0000" },
                      ]}
                    >
                      Total Spendings: ${getTotalCosts(expenses)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={onNextPressed}
                  >
                    <Text style={styles.text}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={categories}
                  keyExtractor={(item) => item.name}
                  renderItem={renderCategoryItem}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                  }}
                />
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
                You don't have anything planned.
              </Text>
            </View>
          )}
        </View>
      </View>

      {isBottomSheetVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={["25%", "40%", "90%"]}
          backgroundStyle={{ backgroundColor: "white" }}
          onChange={handleSheetChanges}
          enablePanDownToClose
        >
          <BottomSheetView
            style={{
              flex: 1,
              alignItems: "center",
              paddingHorizontal: 15,
            }}
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
                  <Donut
                    item={expenses[selectedCategory]}
                    isWithinBudget={
                      expenses[selectedCategory].costs <=
                      getBudget(dashboardSelect) * threshold[selectedCategory]
                    }
                  />
                </View>
                <Text style={styles.subtitle}>Purposes:</Text>
                <BottomSheetFlatList
                  data={Object.entries(expenses[selectedCategory]).filter(
                    (item) => item[0] !== "costs"
                  )}
                  keyExtractor={(item) => item[0]}
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
    paddingBottom: Platform.OS === "ios" ? 60 : 90,
  },
  dashboard: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 170 : 200,
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
  exceedingBudgetCard: {
    borderColor: "red",
    borderWidth: 2,
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
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    backgroundColor: "#735DA5",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});