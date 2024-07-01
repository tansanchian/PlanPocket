import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  VirtualizedList,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Calendar, Agenda } from "react-native-calendars";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import { readScheduleDatabase } from "../../components/Database";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day + 1);
};

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

const height = Platform.OS === "ios" ? 90 : 60;

const TimeTableScreen = ({ navigation }) => {
  const [items, setItems] = useState({});

  const loadItems = useCallback(async (day) => {
    try {
      const data = await readScheduleDatabase();
      const dataLength = data ? data.length : 0;
      const newItems = {};
      for (let i = -15; i < 70; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!newItems[strTime]) {
          newItems[strTime] = [];
          if (dataLength != 0) {
            for (let i = 0; i < dataLength; i++) {
              if (data[i] == undefined) {
                continue;
              }
              if (data[i] && data[i].fromDate === strTime) {
                let curr = parseDate(data[i].fromDate);
                const end = parseDate(data[i].toDate);
                while (curr <= end) {
                  const currStr = timeToString(curr.getTime());
                  if (!newItems[currStr]) {
                    newItems[currStr] = [];
                  }
                  newItems[currStr].push({
                    titleTT: data[i].title,
                    currDateTT: currStr,
                    fromDateTT: data[i].fromDate,
                    setToDateTT: data[i].toDate,
                    setBudgetTT: data[i].budget,
                    setMealTT: data[i].meals,
                    descriptionTT: data[i][currStr]?.description,
                    purposeTT: data[i][currStr]?.purpose,
                    itemz: data[i],
                  });
                  curr.setDate(curr.getDate() + 1);
                }
              }
            }
          }
        }
      }
      setItems(newItems);
    } catch (e) {
      console.error(e.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const today = new Date();
      loadItems({ timestamp: today.getTime() });
    }, [loadItems])
  );
  const ref = React.useRef(null);
  const [activeTab, setActiveTab] = React.useState(0);
  const [index, setIndex] = useState(0);
  // React.useEffect(() => {
  //   ref.current?.scrollToIndex({ index, animated: true });
  // }, [index]);

  const renderItem = (item) => {
    const dataToSend = {
      titleTT: item.titleTT,
      fromDateTT: item.currDateTT,
      toDateTT: item.toDateTT,
      budgetTT: item.budgetTT,
      mealTT: item.meallTT,
    };

    const onPressHandler = () => {
      navigation.navigate("ScheduleForm", dataToSend);
    };

    let transformedData = null;
    const currentDate = item.currDateTT;
    const datas =
      item.itemz.Purpose == undefined ? [] : [item.itemz.Purpose[currentDate]];
    const originalObject = datas[0];

    if (originalObject != undefined) {
      transformedData = Object.keys(originalObject)
        .filter((key) => key !== "lastPurposeId" && key !== "intervals")
        .map((key) => ({
          id: key,
          ...originalObject[key],
        }));
    }

    return (
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>Title: {item.titleTT}</Text>
          <View style={{ alignSelf: "center" }}>
            <TouchableOpacity onPress={onPressHandler}>
              <FontAwesome name="plus" size={20} color="#735DA5" />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          style={{ flexGrow: 0 }}
          data={transformedData}
          ref={ref}
          keyExtractor={(items) => items.key}
          contentContainerStyle={{ paddingLeft: 10 }}
          vertical
          renderItem={({ item, index: fIndex }) => {
            return (
              <TouchableOpacity
                style={{ paddingBottom: 10 }}
                onPress={() => Alert.alert("To be implemented")}
              >
                <View
                  style={{
                    marginRight: 10,
                    padding: 10,
                    borderWidth: 1,
                    borderRadius: 20,
                    borderColor: "#f3eef6",
                    backgroundColor: "#f3eef6",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    elevation: 3,
                    flexShrink: 1,
                  }}
                >
                  {item.purpose && (
                    <Text style={styles.purpose}>Purpose: {item.purpose}</Text>
                  )}
                  {item.description && (
                    <Text style={styles.description}>
                      Description: {item.description}
                    </Text>
                  )}
                  <Text style={styles.description}>
                    Time: {item.fromTimeString} to {item.toTimeString}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Timetable" />
      <Agenda
        items={items}
        showClosingKnob={true}
        loadItemsForMonth={loadItems}
        selected={new Date()}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        theme={{
          calendarBackground: "white",
          agendaKnobColor: "#735DA5",
          agendaTodayColor: "#735DA5",
          selectedDayBackgroundColor: "#735DA5",
        }}
        list={(props) => <VirtualizedList {...props} />}
      />
    </View>
  );
};

export default TimeTableScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: Platform.OS === "ios" ? 90 : 60,
  },
  card: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexShrink: 1,
  },
  innerCard: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#735DA5",
  },
  purpose: {
    fontSize: 14,
    fontWeight: "normal",
    marginBottom: 5,
    color: "black",
  },
  description: {
    fontSize: 12,
    fontWeight: "normal",
    color: "black",
  },
});
