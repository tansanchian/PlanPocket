import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  VirtualizedList,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Calendar, Agenda } from "react-native-calendars";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import { readScheduleDatabase } from "../../components/Database";
import { useFocusEffect } from "@react-navigation/native";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day + 1);
};

const TimeTableScreen = ({ navigation }) => {
  const [items, setItems] = useState({});

  // const [titleTT, setTitleTT] = useState("");
  // const [fromDateTT, setfromDateTT] = useState("");
  // const [toDateTT, setToDateTT] = useState("");
  // const [budgetTT, setBudgetTT] = useState("");
  // const [meallTT, setMealTT] = useState("");

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
              if (data[i].fromDate === strTime) {
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
    return (
      <TouchableOpacity onPress={onPressHandler}>
        <View style={styles.card}>
          <View style={styles.innerCard}>
            <View>
              <Text style={styles.title}>{item.titleTT}</Text>
              {item.purposeTT && (
                <Text style={styles.purpose}>{item.purposeTT}</Text>
              )}
              {item.descriptionTT && (
                <Text style={styles.description}>{item.descriptionTT}</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
  },
  card: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  purpose: {
    fontSize: 14,
    fontWeight: "normal",
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    fontWeight: "normal",
  },
});
