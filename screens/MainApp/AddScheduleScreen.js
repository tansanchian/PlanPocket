import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { StatusBar } from "expo-status-bar";
import { Card, Avatar, IconButton } from "react-native-paper";
import { readScheduleDatabase } from "../../components/Database";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const AddScheduleScreen = () => {
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState(null);
  const onAddSchedulePressed = () => {
    navigation.navigate("ChooseDate");
  };
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await readScheduleDatabase();
        setSchedules(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSchedules();
  }, []);

  const onCalendarPressed = () => {
    console.log("hi");
  };
  const onDeletePressed = () => {};
  const renderCards = ({ item }) => {
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
            <IconButton {...props} icon="delete" onPress={onDeletePressed} />
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
      {schedules == undefined ? (
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
