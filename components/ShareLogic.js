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
    console.log(scheduleData);
    console.log("Item", item);
    return scheduleData;
  } catch (error) {
    console.error("LoadScheduleError", error);
    throw error;
  }
}
