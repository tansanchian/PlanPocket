import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import HomeScreenHeader from "./HomeScreenHeader";
import { StatusBar } from "expo-status-bar";
import PieChart from "react-native-pie-chart";
import { FontAwesome5 } from "@expo/vector-icons";

const HomeScreen = ({ route }) => {
  const { expenses } = route.params;
  const expense = Object.entries(expenses);
  console.log(expense);

  const getTotalCosts = (spendings) => {
    return Object.values(spendings).reduce((total, category) => {
      if (category && category.costs) {
        return total + category.costs;
      }
      return total;
    }, 0);
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

  const colors = [
    "#FFCCCC", // Light Coral
    "#FFCC99", // Peach-Orange
    "#FFEB99", // Light Goldenrod
    "#FFFF99", // Light Yellow
    "#CCFFCC", // Pale Green
    "#99FFCC", // Light Aquamarine
  ];

  const transformData = (item) => {
    let keyCounter = 1;
    const data = [];

    for (const [label, value] of item) {
      data.push({
        key: keyCounter,
        amount: value.costs,
        svg: { fill: colors[(keyCounter - 1) % colors.length] },
        label: label,
      });
      keyCounter++;
    }
    return data;
  };

  const data = transformData(Object.entries(expenses));

  const widthAndHeight = 200;
  const series = data.map((item) => item.amount);
  const sliceColor = data.map((item) => item.svg.fill);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.historyItem}>
        <View style={styles.historyIcon}>
          <FontAwesome5 name={getIcon(item[0])} size={24} color="black" />
        </View>
        <View style={styles.historyText}>
          <Text style={styles.historyName}>{item[0]}</Text>
        </View>
        <Text style={styles.historyAmount}>${item[1].costs}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <HomeScreenHeader title="Dashboard" />
      <View style={styles.internalContainer}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PieChart
              widthAndHeight={widthAndHeight}
              series={series}
              sliceColor={sliceColor}
              doughnut={true}
              coverFill={"#FFF"}
              coverRadius={0.6}
            />
            <View
              style={{
                flex: 1,
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", textAlign: " center" }}>
                Total Spendings
              </Text>
              <Text style={{ fontWeight: "bold", textAlign: " center" }}>
                ${getTotalCosts(expenses)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.legend}>
          {data.map((item) => (
            <View key={item.key} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: item.svg.fill }]}
              />
              <Text style={styles.legendText}>{item.label}</Text>
              <Text style={styles.legendAmount}>${item.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.tabs}></View>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Categories:</Text>
        </View>
        <FlatList
          data={expense}
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  internalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3eef6",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  legendItem: {
    alignItems: "center",
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  legendText: {
    fontSize: 12,
  },
  legendAmount: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    fontSize: 16,
    color: "#888",
    marginHorizontal: 10,
  },
  tabActive: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  historySort: {
    fontSize: 14,
    color: "#888",
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
  },
  historyIcon: {
    marginRight: 15,
  },
  historyText: {
    flex: 1,
  },
  historyName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  historyStatus: {
    fontSize: 14,
    color: "#888",
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
