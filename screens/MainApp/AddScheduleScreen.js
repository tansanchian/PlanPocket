import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const userId = auth.currentUser?.uid;

    const schedulesRef = ref(db, `/users/${userId}/schedules`);
    const unsubscribe = onValue(schedulesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const schedulesArray = Object.values(data);
        setSchedules(schedulesArray);
      } else {
        setSchedules([]);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const onCalendarPressed = () => {
    console.log("hi");
  };

  const onDeletePressed = async (fromDate, toDate) => {
    try {
      await deleteScheduleDatabase(fromDate, toDate);
      // The schedules state will automatically update due to the real-time listener
    } catch (error) {
      console.error(error);
    }
  };

  const renderCards = ({ item }) => {
    if (!item) {
      return null;
    }
    return (
      <Card style={styles.card}>
        <Card.Title
          title={item.title}
          subtitle={`Budget: ${item.budget}`}
          left={(props) => (
            <TouchableOpacity onPress={onCalendarPressed}>
              <Avatar.Icon {...props} icon="calendar" />
            </TouchableOpacity>
          )}
          right={(props) => (
            <IconButton
              {...props}
              icon="delete"
              onPress={() => onDeletePressed(item.fromDate, item.toDate)}
            />
          )}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
        />
        <Card.Content>
          <Text style={styles.dateText}>
            {item.fromDate} to {item.toDate}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="AddSchedule" />
      {schedules.length === 0 ? (
        <View style={styles.internalContainer}>
          <Text style={styles.text}>No Current Schedule</Text>
          <CustomButton text="Add Schedule" onPress={onAddSchedulePressed} />
        </View>
      ) : (
        <View style={styles.internalContainer}>
          <View style={styles.flatList}>
            <FlatList
              data={schedules}
              renderItem={renderCards}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
          <View style={styles.button}>
            <CustomButton text="Add Schedule" onPress={onAddSchedulePressed} />
          </View>
        </View>
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
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    justifyContent: "center",
    margin: 10,
  },
  flatList: {
    flex: 1.5,
  },
  card: {
    marginVertical: 10,
    borderRadius: 30,
    elevation: 2,
    width: 350,
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
  },
  flatListContent: {
    paddingVertical: 20,
    marginHorizontal: 20,
  },
  button: {
    flex: 1,
    width: "100%",
  },
});
