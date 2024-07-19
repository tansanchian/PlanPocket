import { View, Text, StyleSheet, Platform } from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import { Card, Avatar, IconButton } from "react-native-paper";
import { getDatabase, ref, onValue } from "firebase/database";
import { deleteScheduleDatabase } from "../../components/Database";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getAuth } from "firebase/auth";

const AddScheduleScreen = () => {
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState([]);

  const onAddSchedulePressed = () => {
    navigation.navigate("ChooseDate");
  };

  const formatDate = (dateString) => {
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

    const date = new Date(dateString);

    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    return `${month} ${day}`;
  };

  const getYear = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();

    return year.toString();
  };

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const userId = auth.currentUser?.uid;

    const schedulesRef = ref(db, `/users/${userId}/schedules`);
    const unsubscribe = onValue(schedulesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSchedules(Object.entries(data));
      } else {
        setSchedules([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const onCalendarPressed = (data) => {
    navigation.navigate("TimeTableScreen", { jump: data });
  };

  const onDeletePressed = async (id) => {
    try {
      await deleteScheduleDatabase(id);
    } catch (error) {
      console.error(error);
    }
  };

  const renderComponentOne = ({ item }) => {
    if (!item) {
      return null;
    }
    return (
      <Card style={styles.card}>
        <Card.Title
          title={item[1].title}
          subtitle={`Budget: ${item[1].budget}`}
          left={(props) => (
            <TouchableOpacity
              onPress={() => onCalendarPressed(item[1].fromDate)}
            >
              <Avatar.Icon {...props} icon="calendar" />
            </TouchableOpacity>
          )}
          right={(props) => (
            <IconButton
              {...props}
              icon="delete"
              onPress={() => onDeletePressed(item[0])}
            />
          )}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
        />
        <Card.Content>
          <Text style={styles.dateText}>Year: {getYear(item[1].fromDate)}</Text>
          <Text style={styles.dateText}>
            Date: {formatDate(item[1].fromDate)} to {formatDate(item[1].toDate)}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const renderComponentTwo = () => (
    <View>
      <CustomButton text="Add Schedule" onPress={onAddSchedulePressed} />
    </View>
  );

  const latestDate = useMemo(() => {
    if (schedules.length === 0) return null;
    return schedules.reduce((latest, item) => {
      const itemDate = new Date(item[1].toDate);
      return itemDate > latest ? latest : itemDate;
    }, new Date(schedules[0].toDate));
  }, [schedules]);

  const renderItem = ({ item }) => {
    const itemDate = new Date(item[1].toDate);
    const isLatestDate = itemDate.getTime() === latestDate.getTime();
    return (
      <View>
        {isLatestDate && renderComponentTwo()}
        {renderComponentOne({ item })}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="AddSchedule" />
      {schedules.length === 0 ? (
        <View style={styles.internalContainer}>
          <Text style={styles.text}>No Current Schedule</Text>
          <CustomButton text="Add Schedule" onPress={onAddSchedulePressed} />
        </View>
      ) : (
        <>
          <FlatList
            style={styles.flatContainer}
            data={schedules}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
          />
        </>
      )}
    </View>
  );
};

export default AddScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  internalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3eef6",
    paddingHorizontal: 20,
  },
  flatContainer: { flex: 1, backgroundColor: "#f3eef6" },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    justifyContent: "center",
    margin: 10,
  },
  card: {
    marginVertical: 10,
    borderRadius: 25,
    elevation: 2,
    width: 400,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  dateText: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 5,
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 90 : 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
