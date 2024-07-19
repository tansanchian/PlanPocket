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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import BottomSheet from "@gorhom/bottom-sheet";
import TimeTableEditor from "../../components/TimeTableEditor";
import { Ionicons } from "@expo/vector-icons";
import TimeTableBudgetEditor from "../../components/TimeTableBudgetEditor";

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
  const date = new Date(dateInput.getTime() - 8 * 60 * 60 * 1000);

  const formatTime12Hour = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
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

  const dayOfWeek = dayNames[date.getDay()];
  const monthName = monthNames[date.getMonth()];
  const day = date.getDate();
  const time = formatTime12Hour(date);

  const formattedDate = `${dayOfWeek}, ${monthName} ${day}, ${time} (local time)`;

  return formattedDate;
};

function getDay(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  return `${day}`;
}

function getShortDay(dateString) {
  const date = new Date(dateString);
  const options = { weekday: "short" };
  const weekday = new Intl.DateTimeFormat("en-US", options).format(date);
  return `${weekday}`;
}

const TimeTableScreen = ({ route }) => {
  const navigation = useNavigation();
  const [items, setItems] = useState({});
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [flatListItem, setflatListItem] = useState(null);
  const [edit, setEdit] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const bottomSheetRef = useRef(null);
  const bottomSheetEditBudgetRef = useRef(null);
  const [editBudget, setEditBudget] = useState(false);
  const [budgetItem, setBudgetItem] = useState(null);
  const [bottomSheetDate, setBottomSheetDate] = useState("");
  const [jumpDate, setJumpDate] = useState(new Date());

  const jump = route.params || new Date();

  useEffect(() => {
    if (jump && jump.jump) {
      const date = new Date(jump.jump);
      console.log(date);
      setJumpDate(date);
    }
  }, [jump]);

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

  const handleSheetEditBudgetChanges = useCallback((index) => {
    console.log("handleSheetEditBudgetChanges", index);
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
            for (let j = 0; j < dataLength; j++) {
              if (!dataArray[j][1]) continue;

              if (dataArray[j][1].fromDate === strTime) {
                let curr = parseDate(dataArray[j][1].fromDate);
                const end = parseDate(dataArray[j][1].toDate);

                while (curr <= end) {
                  const currStr = timeToString(curr.getTime());

                  if (!newItems[currStr]) {
                    newItems[currStr] = [];
                  }

                  newItems[currStr].push({
                    currDateTT: currStr,
                    data: dataArray[j],
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
      dateTT: item.currDateTT,
    };

    const onPressHandler = () => {
      navigation.navigate("ScheduleForm", dataToSend);
    };

    const datas = item.data[1].purpose;
    let dataArray = [];
    if (datas !== undefined) {
      dataArray = Object.entries(datas).filter((entry) => {
        return (
          new Date(entry[1].fromTime).toISOString().split("T")[0] ===
          item.currDateTT
        );
      });
      dataArray.forEach((entry) => {
        if (entry[1] !== undefined) {
          entry[1].date = item.currDateTT;
        }
      });
    }
    return (
      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flex: 0.5, alignItems: "flex-start" }}>
            <Text style={styles.title}>Title: {item.data[1].title}</Text>
          </View>
          <View style={{ flex: 0.5, alignItems: "flex-end" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ paddingHorizontal: 20 }}
                onPress={() => {
                  setBudgetItem(item.data);
                  setEditBudget(true);
                  setBottomSheetVisible(false);
                  if (bottomSheetEditBudgetRef.current) {
                    bottomSheetEditBudgetRef.current.snapToIndex(1);
                  }
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#735DA5" }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPressHandler}>
                <Ionicons name="add-circle-outline" size={20} color="#735DA5" />
              </TouchableOpacity>
            </View>
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
                  setEditBudget(false);
                  setSelectedDate(item[1].date);
                  setBottomSheetDate(item[1].date);
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
                    marginTop: 10,
                    marginLeft: 5,
                    borderWidth: 1,
                    borderRadius: 5,
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
        selected={jumpDate}
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
      {editBudget && (
        <BottomSheet
          ref={bottomSheetEditBudgetRef}
          index={1}
          snapPoints={["25%", "50%", "90%"]}
          backgroundStyle={styles.bottomSheetBackground}
          onChange={handleSheetEditBudgetChanges}
          enablePanDownToClose
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                marginBottom: 10,
              }}
            >
              Edit Budget
            </Text>
          </View>
          <TimeTableBudgetEditor item={budgetItem} />
        </BottomSheet>
      )}
      {isBottomSheetVisible && flatListItem && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={["25%", "50%", "90%"]}
          backgroundStyle={styles.bottomSheetBackground}
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
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <View style={styles.iconContainer}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "900",
                  }}
                >
                  {getDay(bottomSheetDate)}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "900",
                  }}
                >
                  {getShortDay(selectedDate)}
                </Text>
              </View>
            </View>
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
                <TimeTableEditor id={flatListItem[0]} date={selectedDate} />
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
    borderRadius: 15,
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
  },
  purposeItem: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bottomSheetBackground: {
    backgroundColor: "white",
    borderRadius: 25,
  },
});
