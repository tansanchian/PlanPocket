import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  scrollToIndex,
} from "react-native";
import { Svg, G, Path, Circle, Text as CText } from "react-native-svg";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";

const HomeScreen = () => {
  const data = [
    { key: 1, amount: 30, svg: { fill: "#CCCCCC" }, label: "Other" },
    { key: 2, amount: 62.5, svg: { fill: "#FF6384" }, label: "Food" },
    { key: 3, amount: 30, svg: { fill: "#36A2EB" }, label: "Fuel" },
    { key: 4, amount: 20, svg: { fill: "#FFCE56" }, label: "Health" },
    { key: 5, amount: 12.5, svg: { fill: "#4BC0C0" }, label: "Others" },
  ];

  const months = [
    { key: 1, label: "January" },
    { key: 2, label: "February" },
    { key: 3, label: "March" },
    { key: 4, label: "April" },
    { key: 5, label: "May" },
    { key: 6, label: "June" },
    { key: 7, label: "July" },
    { key: 8, label: "August" },
    { key: 9, label: "September" },
    { key: 10, label: "October" },
    { key: 11, label: "November" },
    { key: 12, label: "December" },
  ];
  const widthAndHeight = 200;
  const series = data.map((item) => item.amount);
  const sliceColor = data.map((item) => item.svg.fill);
  const radius = widthAndHeight / 2;
  const innerRadius = 0.6 * radius;
  const history = [
    {
      id: "1",
      name: "Dropbox",
      amount: "$750",
      status: "Sent",
      icon: "dropbox",
    },
    {
      id: "2",
      name: "Netflix",
      amount: "$159.8",
      status: "Subscription",
      icon: "netflix",
    },
    {
      id: "3",
      name: "Lorry Anderson",
      amount: "$750",
      status: "Sent",
      icon: "user",
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyIcon}>
        <Text>{item.icon}</Text>
      </View>
      <View style={styles.historyText}>
        <Text style={styles.historyName}>{item.name}</Text>
        <Text style={styles.historyStatus}>{item.status}</Text>
      </View>
      <Text style={styles.historyAmount}>{item.amount}</Text>
    </View>
  );
  const createDonutChart = () => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    let cumulativeAngle = 0;

    return data.map((item, index) => {
      const valueAngle = (item.amount / total) * 2 * Math.PI;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + valueAngle;
      cumulativeAngle += valueAngle;

      const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

      const startX = radius + radius * Math.cos(startAngle);
      const startY = radius - radius * Math.sin(startAngle);
      const endX = radius + radius * Math.cos(endAngle);
      const endY = radius - radius * Math.sin(endAngle);

      const innerStartX = radius + innerRadius * Math.cos(startAngle);
      const innerStartY = radius - innerRadius * Math.sin(startAngle);
      const innerEndX = radius + innerRadius * Math.cos(endAngle);
      const innerEndY = radius - innerRadius * Math.sin(endAngle);

      const pathData = [
        `M ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${endX} ${endY}`,
        `L ${innerEndX} ${innerEndY}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStartX} ${innerStartY}`,
        `Z`,
      ].join(" ");

      return <Path key={index} d={pathData} fill={item.svg.fill} />;
    });
  };

  const ref = React.useRef(null);
  const [activeTab, setActiveTab] = React.useState(0);
  const [index, setIndex] = useState(0);
  React.useEffect(() => {
    ref.current?.scrollToIndex({ index, animated: true });
  }, [index]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="HomeScreen" />
      <View style={styles.internalContainer}>
        <Svg width={widthAndHeight} height={widthAndHeight}>
          {createDonutChart()}
          <Circle cx={radius} cy={radius} r={innerRadius} fill="#f3eef6" />
          <CText
            x={radius}
            y={radius}
            fill="black"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            dy=".3em"
          >
            Current
          </CText>
          <CText
            x={radius}
            y={radius + 20}
            fill="black"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            dy=".3em"
          >
            Spend
          </CText>
        </Svg>
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
        <View style={styles.tabs}>
          <FlatList
            style={{ flexGrow: 0 }}
            data={months}
            ref={ref}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ paddingLeft: 10 }}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({ item, index: fIndex }) => {
              return (
                <TouchableOpacity onPress={() => {}}>
                  <View
                    style={{
                      marginRight: 10,
                      padding: 10,
                      borderWidth: 2,
                      borderRadius: 12,
                      borderColor: "#abc",
                    }}
                  >
                    <Text>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>History</Text>
          <Text style={styles.historySort}>Sort by Recent</Text>
        </View>
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
