import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { readScheduleDatabase } from "./Database";

export default async function ShareLogic(item) {
  try {
    const scheduleData = await readScheduleDatabase();
    console.log("Item", scheduleData);

    if (scheduleData != undefined) {
      const temp = scheduleData.map((x) => x.fromDate);
      console.log(temp);
    }
  } catch (error) {
    console.error("LoadScheduleError", error);
    throw error;
  }
}
