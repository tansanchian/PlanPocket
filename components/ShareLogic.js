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
import { checkScheduleOverlap } from "./Database";

export default async function ShareLogic(item) {
  try {
    const fromDate = item.fromDate;
    const toDate = item.toDate;
    const checkSchedule = await checkScheduleOverlap(fromDate, toDate);
    return checkSchedule;
  } catch (error) {
    console.error("LoadScheduleError", error);
    throw error;
  }
}
