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

const parseTime = (x) => {
  function convertTo12HourFormat(timeString) {
    const [hours, minutes] = timeString.split(":");

    const dateObj = new Date();
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes);

    const formattedTime = dateObj.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return formattedTime;
  }

  return convertTo12HourFormat(x.split("T")[1].substring(0, 5));
};

const TimeTableScreen = ({ navigation }) => {
  const [items, setItems] = useState({});

  const loadItems = useCallback(async (day) => {
    try {
      const data = (await readScheduleDatabase()) || {};
      const dataArray = Object.entries(data) || [];
      const dataLength = dataArray.length;
      const newItems = {};
      for (let i = -15; i < 70; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!newItems[strTime]) {
          newItems[strTime] = [];
          if (dataLength != 0) {
            for (let i = 0; i < dataLength; i++) {
              if (!dataArray[i][1]) continue;
              if (dataArray[i][1].fromDate === strTime) {
                let curr = parseDate(dataArray[i][1].fromDate);
                const end = parseDate(dataArray[i][1].toDate);
                while (curr <= end) {
                  const currStr = timeToString(curr.getTime());
                  if (!newItems[currStr]) {
                    newItems[currStr] = [];
                  }
                  newItems[currStr].push({
                    currDateTT: currStr,
                    fromDateTT: dataArray[i][1].fromDate,
                    setToDateTT: dataArray[i][1].toDate,
                    setBudgetTT: dataArray[i][1].budget,
                    setMealTT: dataArray[i][1].meals,
                    descriptionTT: dataArray[i][1][currStr]?.description,
                    purposeTT: dataArray[i][1][currStr]?.purpose,
                    data: dataArray[i],
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

  const renderItem = (item) => {
    const dataToSend = {
      dataTT: item.data,
    };
    const onPressHandler = () => {
      navigation.navigate("ScheduleForm", dataToSend);
    };

    const datas = item.data[1].purpose;
    let dataArray = [];
    if (datas != undefined) {
      dataArray = Object.entries(datas);
    }

    return (
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>Title: {item.data[1].title}</Text>
          <View style={{ alignSelf: "center" }}>
            <TouchableOpacity onPress={onPressHandler}>
              <FontAwesome name="plus" size={20} color="#735DA5" />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          style={{ flexGrow: 0 }}
          data={dataArray}
          ref={ref}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingLeft: 10 }}
          vertical
          renderItem={({ item, index: fIndex }) => {
            return (
              <View style={{ paddingBottom: 10 }}>
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
                  {item[1].purpose && (
                    <Text style={styles.purpose}>
                      Purpose: {item[1].purpose}
                    </Text>
                  )}
                  {item[1].description && (
                    <Text style={styles.description}>
                      Description: {item[1].description}
                    </Text>
                  )}
                  <Text style={styles.description}>
                    Time: {parseTime(item[1].fromTime)} to{" "}
                    {parseTime(item[1].toTime)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
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
