import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PieChart from "react-native-pie-chart";

const Donut = ({ item, isWithinBudget }) => {
  const colors = [
    "#FFCCCC", // Light Coral
    "#FFCC99", // Peach-Orange
    "#FFEB99", // Light Goldenrod
    "#FFFF99", // Light Yellow
    "#CCFFCC", // Pale Green
    "#99FFCC", // Light Aquamarine
    "#CCFFFF", // Pale Cyan
    "#99CCFF", // Light Sky Blue
    "#CCCCFF", // Lavender
    "#FFCCFF", // Pale Lavender
    "#FF99CC", // Pale Pink
    "#FFCCFF", // Light Violet
    "#FF99FF", // Light Magenta
    "#CC99FF", // Light Purple
    "#99CCFF", // Light Slate Blue
    "#CCCCFF", // Light Blue
    "#CCFF99", // Light Lime
    "#FFFFCC", // Light Cream
    "#FFCCCC", // Light Salmon
    "#FFCC99", // Light Peach
  ];

  const convertItem = (item) => {
    let keyCounter = 1;
    const data = [];
    for (const [label, value] of Object.entries(item)) {
      if (label !== "costs") {
        data.push({
          key: keyCounter,
          amount: value.subcosts,
          svg: { fill: colors[(keyCounter - 1) % colors.length] },
          label: label,
        });
        keyCounter++;
      }
    }
    return data;
  };

  const data = convertItem(item);
  const widthAndHeight = 200;
  const series = data.map((item) => item.amount);
  const sliceColor = data.map((item) => item.svg.fill);

  return (
    <View style={styles.internalContainer}>
      <View style={styles.row}>
        <View
          style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}
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
            {isWithinBudget ? (
              <>
                <Text style={{ fontWeight: "bold", textAlign: "center" }}>
              Total Spendings
            </Text>
            <Text style={{ fontWeight: "bold", textAlign: "center" }}>
              ${item.costs}
                </Text>
              </>) : (
                  <><Text style={{ fontWeight: "bold", textAlign: "center", color: 'red'}}>
              Total Spendings
            </Text>
            <Text style={{ fontWeight: "bold", textAlign: "center", color: 'red'}}>
              ${item.costs}
            </Text></>)}
            
          </View>
        </View>
        {isWithinBudget ? (
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ padding: 10, fontWeight: "bold", textAlign: "center" }}
            >
              Good job! You're spending within your budget.
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ padding: 10, fontWeight: "bold", textAlign: "center", color: 'red' }}
            >
                Your spending in this category exceeds your allocated proportion. Consider reducing expenses
                or visit the settings screen to adjust your budget allocation for each category.
            </Text>
          </View>
        )}
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
    </View>
  );
};

export default Donut;

const styles = StyleSheet.create({
  internalContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
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
});
