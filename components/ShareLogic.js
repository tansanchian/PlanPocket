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
  function getDateOnly(isoString) {
    const date = new Date(isoString);
    return date.toISOString().split("T")[0];
  }

  try {
    const fromDate = getDateOnly(item.fromDate);
    const toDate = getDateOnly(item.toDate);
    console.log("logic", fromDate, toDate);
    const checkSchedule = await checkScheduleOverlap(fromDate, toDate);
    return checkSchedule;
  } catch (error) {
    console.error("LoadScheduleError", error);
    throw error;
  }
}
