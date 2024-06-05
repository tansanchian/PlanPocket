import { Text, View, TouchableOpacity, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { Calendar, Agenda } from "react-native-calendars";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import { readScheduleDatabase } from "../../components/Database";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const calculateDateDifference = (date1, date2) => {
  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month, day); 
  };
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  const timeDifference = d1 - d2;
  const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
  return Math.abs(dayDifference) + 1;
};

const TimeTableScreen = () => {
  const [items, setItems] = useState({});

  const addItemToSpecificDate = (dateString, item) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (!updatedItems[dateString]) {
        updatedItems[dateString] = [];
      }
      updatedItems[dateString].push(item);
      return updatedItems;
    });
  };

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month, day);
  };
  
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth()).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const dataArray = await readScheduleDatabase();
        const dateArray = dataArray.map(x => {
          return [x.fromDate, x.toDate, x.purpose];
        });
        for (const item of dateArray) {
          let dateString = item[0];
          const purpose = item[2];
          for (let i = 0; i < calculateDateDifference(item[0], item[1]); i++) {
            const newItem = {
              name: purpose,
              height: 80,
              day: dateString,
            };
            addItemToSpecificDate(dateString, newItem);
            const d1 = parseDate(dateString);
            d1.setDate(d1.getDate() + 1);
            dateString = formatDate(d1);
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    }
    loadData();
  }, []);

  const loadItems = (day) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];
          items[strTime].push({
            name: "",
            height: 50,
            day: strTime,
          });
        }
      }
      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity>
        <Text
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDay = (day) => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>;
    }
    return <View style={styles.dayItem} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Timetable" />
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={new Date()}
        renderItem={renderItem}
        theme={{ calendarBackground: "white", agendaKnobColor: "black" }}
        showClosingKnob={true}
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
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green",
  },
  dayItem: {
    marginLeft: 34,
  },
});
