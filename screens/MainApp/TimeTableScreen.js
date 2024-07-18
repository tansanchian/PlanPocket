import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  VirtualizedList,
  FlatList,
  Alert,
  Platform,
  Button,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Calendar, Agenda } from "react-native-calendars";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import { readScheduleDatabase } from "../../components/Database";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import BottomSheet from "@gorhom/bottom-sheet";
import TimeTableEditor from "../../components/TimeTableEditor";
import { Ionicons } from "@expo/vector-icons";

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

const formatTimestamp = (timestamp) => {
  const dateInput = new Date(timestamp);
  const date = new Date(dateInput - 8 * 60 * 60 * 1000);

  const getDayOfWeek = (date) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[date.getDay()];
  };

  const getMonthName = (date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[date.getMonth()];
  };

  const formatTime12Hour = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  const formattedDate = `${getDayOfWeek(date)} ${getMonthName(
    date
  )} ${date.getDate()} ${formatTime12Hour(date)} (local time)`;

  return formattedDate;
};

const TimeTableScreen = ({ navigation }) => {
  const [items, setItems] = useState({});
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [flatListItem, setflatListItem] = useState(null);
  const [edit, setEdit] = useState(false);
  const bottomSheetRef = useRef(null);

  console.log(flatListItem);

  const onEditPressed = () => {
    setEdit(true);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(2);
    }
  };

  const onCancelEditPressed = () => {
    setEdit(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1);
    }
  };

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

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

  const ref = useRef(null);

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
          keyExtractor={(item, index) => `${item[0]}-${index}`}
          contentContainerStyle={{ paddingLeft: 10 }}
          vertical
          renderItem={({ item, index: fIndex }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setBottomSheetVisible(true);
                  setflatListItem(item);
                  if (bottomSheetRef.current) {
                    bottomSheetRef.current.snapToIndex(1);
                  }
                }}
                style={{ paddingBottom: 10 }}
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
              </TouchableOpacity>
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
      {isBottomSheetVisible && flatListItem && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={["25%", "50%", "90%"]}
          backgroundStyle={{ backgroundColor: "#f3eef6" }}
          onChange={handleSheetChanges}
          enablePanDownToClose
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "900",
                  marginBottom: 10,
                }}
              >
                Purpose
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              {!edit ? (
                <TouchableOpacity
                  onPress={onEditPressed}
                  style={styles.iconContainer}
                >
                  <Ionicons name="create-outline" size={30} color="black" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={onCancelEditPressed}
                  style={styles.iconContainer}
                >
                  <Ionicons name="close-outline" size={30} color="black" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={{ marginTop: 10, flex: 1 }}>
            {edit ? (
              <View style={{ alignItems: "center" }}>
                <TimeTableEditor id={flatListItem[0]} />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  paddingHorizontal: 20,
                }}
              >
                <View style={styles.purposeItem}>
                  <Ionicons name="happy-outline" size={30} color="black" />
                  <Text style={{ marginLeft: 10, fontSize: 20 }}>
                    {flatListItem[1].category}
                  </Text>
                </View>
                <View style={styles.purposeItem}>
                  <Ionicons
                    name="accessibility-outline"
                    size={30}
                    color="black"
                  />
                  <View style={{ marginLeft: 10, flexDirection: "column" }}>
                    <Text style={{ fontSize: 20 }}>
                      {flatListItem[1].purpose}
                    </Text>
                    <Text style={{ fontSize: 16, color: "gray" }}>
                      {formatTimestamp(flatListItem[1].fromTime)}
                    </Text>
                  </View>
                </View>
                <View style={styles.purposeItem}>
                  <Ionicons name="cash-outline" size={30} color="black" />
                  <Text style={{ marginLeft: 10, fontSize: 20 }}>
                    ${flatListItem[1].costs}
                  </Text>
                </View>
                <View style={styles.purposeItem}>
                  <Ionicons name="document-outline" size={30} color="black" />
                  <Text style={{ marginLeft: 10, fontSize: 20 }}>
                    {flatListItem[1].description || "Empty..."}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </BottomSheet>
      )}
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
  iconContainer: {
    marginHorizontal: 16,
    height: 45,
    width: 45,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3eef6",
  },
  purposeItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
});
