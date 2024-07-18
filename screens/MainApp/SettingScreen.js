import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Slider from "@react-native-community/slider";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { ref, get, child, update } from "firebase/database";
import CustomButton from "../../components/CustomButton";
import HomeScreenHeader from "./HomeScreenHeader";

const SettingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sliderValues, setSliderValues] = useState({
   "Dining": 0.2,
   "Transportation": 0.1,
   "Entertainment & Leisure": 0.15,
   "Shopping": 0.2,
   "Bill, Utilities & Taxes": 0.2,
   "Uncategorized": 0.15,
  });

  const roundToStep = (value) => {
    return Number(value).toFixed(2);
  };

  const readThreshold = async () => {
    const dbRef = ref(getDatabase());
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    try {
      const snapshot = await get(child(dbRef, `users/${userId}/Threshold`));
      if (snapshot.exists()) {
        const curr = snapshot.val();
        console.log("Current values from DB: ", curr);
        setSliderValues({
          "Dining": roundToStep(curr["Dining"] || 0),
          "Entertainment & Leisure": roundToStep(curr["Entertainment & Leisure"] || 0),
          "Shopping": roundToStep(curr["Shopping"] || 0),
          "Bill, Utilities & Taxes": roundToStep(curr["Bill, Utilities & Taxes"] || 0),
          "Transportation": roundToStep(curr["Transportation"] || 0),
          "Uncategorized": roundToStep(curr["Uncategorized"] || 0),
        });
      } else {
        console.log("No data available");
      }
    } catch (e) {
      console.error("Error reading threshold: ", e);
    } finally {
      setLoading(false);
    }
  };
  

  const writeThreshold = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();
    const userRef = ref(db, "users/" + user.uid + "/Threshold");

    try {
      await update(userRef, sliderValues);
      Alert.alert("Success", "Allocation updated!");
      console.log("Database update successful");
      return true;
    } catch (error) {
      console.error("Error writing to database:", error);
      Alert.alert("Error", "Error writing to database");
      return false;
    }
  };

  useEffect(() => {
    readThreshold();
  }, []);

  useEffect(() => {
    console.log("Updated slider values: ", sliderValues);
  }, [sliderValues]);

  const handleValueChange = (value, category) => {
    const roundedValue = roundToStep(value);
    setSliderValues((prevValues) => ({
      ...prevValues,
      [category]: roundedValue,
    }));
  };

  const data = [
    { category: "Dining", label: "Dining" },
    { category: "Entertainment & Leisure", label: "Entertainment & Leisure" },
    { category: "Shopping", label: "Shopping" },
    { category: "Bill, Utilities & Taxes", label: "Bill, Utilities & Taxes" },
    { category: "Transportation", label: "Transportation" },
    { category: "Uncategorized", label: "Others" },
  ];

  const groupedData = [];
  for (let i = 0; i < data.length; i += 2) {
    groupedData.push(data.slice(i, i + 2));
  }

  const renderSliderItem = ({ item }) => (
    <View style={styles.rowContainer}>
      {item.map((sliderItem) => (
        <View style={styles.sliderContainer} key={sliderItem.category}>
          <Text style={styles.label}>{sliderItem.label}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            minimumTrackTintColor="#8e44ad"
            maximumTrackTintColor="#bdc3c7"
            thumbTintColor="#8e44ad"
            onValueChange={(value) =>
              handleValueChange(value, sliderItem.category)
            }
            value={parseFloat(sliderValues[sliderItem.category])}
          />
          <Text style={styles.valueText}>
            Value: {(sliderValues[sliderItem.category] * 100).toFixed(0)}%
          </Text>
        </View>
      ))}
    </View>
  );

  const onSavePressed = () => {
    const sum = Object.values(sliderValues).reduce(
      (x, y) => x + parseFloat(y),
      0
    );
    console.log(sum);
    if (sum == 1) {
      writeThreshold();
    } else {
      Alert.alert("Error", "Sum must be 100%");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await readThreshold();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <HomeScreenHeader title="Settings" />
      <View style={styles.internalContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <View>
            <Text style={styles.title}>Allocate Your Budget Wisely</Text>
            <FlatList
              data={groupedData}
              renderItem={renderSliderItem}
              keyExtractor={(item, index) => `group_${index}`}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
            <CustomButton text="Save" onPress={onSavePressed} />
          </View>
        )}
      </View>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  internalContainer: {
    flex: 1,
    alignContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    margin: 20,
    textAlign: "center",
  },
  flatListContent: {
    paddingVertical: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  sliderContainer: {
    width: "45%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: 'center'
  },
  slider: {
    width: "100%",
    height: 40,
  },
  valueText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  error: {
    fontSize: 14,
    color: "red",
    marginBottom: 10,
  },
});
