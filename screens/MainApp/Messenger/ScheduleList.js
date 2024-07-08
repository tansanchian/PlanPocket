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
import { readPurposeDatabase } from "../../../components/Database";

const ScheduleList = ({ route }) => {
  const { data } = route.params;
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState([]);

  const fetchPurposes = async () => {
    try {
      const purposeDB = await readPurposeDatabase();
      const data = [];
      purposeDB.forEach((item) => {
        const purposeObj = item.Purpose;
        const lastDateKey = Object.keys(purposeObj).pop();
        const lastPurposeId = purposeObj[lastDateKey].lastPurposeId + 1;
        for (let i = 0; i < lastPurposeId; i++) {
          const firstDateKey = Object.keys(purposeObj)[0];
          const purposeItem = {
            ...purposeObj[firstDateKey][i],
            lastDateKey: lastDateKey,
          };
          data.push(purposeItem);
        }
      });
      console.log("fetch", data);
      setSchedules(data);
    } catch (e) {
      console.error("Purpose", e);
      return [];
    }
  };

  useEffect(() => {
    fetchPurposes();
  }, []);

  const onSharePressed = ({ item }) => {
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
    if (!item) {
      return null;
    }
    return (
      <Card style={styles.card}>
        <Card.Title
          title={`Category: ${item.category}`}
          right={(props) => (
            <IconButton
              {...props}
              icon="share"
              onPress={() => onSharePressed({ item })}
            />
          )}
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Text style={styles.dateText}>Purpose: {item.purpose}</Text>
          <Text style={styles.dateText}>Cost: ${item.costs}</Text>
          {item.description !== "" && (
            <Text style={styles.descriptionText}>
              Description: {item.description}
            </Text>
          )}
          <Text style={styles.dateText}>
            Time: {item.fromTimeString} to {item.toTimeString}
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
          data={schedules}
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
