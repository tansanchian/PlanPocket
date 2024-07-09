import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import { StatusBar } from "expo-status-bar";
import { Card, IconButton } from "react-native-paper";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const ScheduleList = ({ route }) => {
  const { data } = route.params;
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState([]);
  const [purpose, setPurpose] = useState([]);

  const parseTime = (x) => {
    const convertTo12HourFormat = (timeString) => {
      const [hours, minutes] = timeString.split(":");
      const dateObj = new Date();
      dateObj.setHours(hours);
      dateObj.setMinutes(minutes);
      return dateObj.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    };
    return convertTo12HourFormat(x.split("T")[1].substring(0, 5));
  };

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const userId = auth.currentUser?.uid;

    const schedulesRef = ref(db, `/users/${userId}/schedules`);
    const unsubscribe = onValue(schedulesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const allPurposes = [];

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const item = data[key];
            if (item.purpose) {
              const purposesWithDate = Object.entries(item.purpose).map(
                ([purposeKey, purposeValue]) => ({
                  purposeKey,
                  purposeValue,
                  purposeFromDate: item.fromDate,
                  purposeToDate: item.toDate,
                })
              );
              allPurposes.push(...purposesWithDate);
            }
          }
        }

        setPurpose(allPurposes);
        setSchedules(Object.entries(data));
      } else {
        setSchedules([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const onSharePressed = (item) => {
    console.log("Shared", item);
    Alert.alert(
      "Share",
      "Are you sure you want to share this schedule?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => navigation.navigate("Messenger", { data, item }),
        },
      ],
      { cancelable: true }
    );
  };

  const renderComponentOne = ({ item }) => {
    if (!item.purposeValue) {
      return null;
    }
    const data = item.purposeValue;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={`Category: ${data.category}`}
          right={(props) => (
            <IconButton
              {...props}
              icon="share"
              onPress={() => onSharePressed(item)}
            />
          )}
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Text style={styles.dateText}>Purpose: {data.purpose}</Text>
          <Text style={styles.dateText}>Cost: ${data.costs}</Text>
          {data.description !== "" && (
            <Text style={styles.descriptionText}>
              Description: {data.description}
            </Text>
          )}
          <Text style={styles.dateText}>
            Time: {parseTime(data.fromTime)} to {parseTime(data.toTime)}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const renderItem = ({ item }) => {
    return <View>{renderComponentOne({ item })}</View>;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Share Schedule" />
      {schedules.length === 0 ? (
        <View style={styles.internalContainer}>
          <Text style={styles.text}>No Current Schedule</Text>
        </View>
      ) : (
        <FlatList
          style={styles.flatContainer}
          data={purpose}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

export default ScheduleList;

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
    borderRadius: 50,
    elevation: 2,
    width: 400,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    fontSize: 16,
    marginBottom: 5,
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 90 : 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
