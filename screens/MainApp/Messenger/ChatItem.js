import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ChatItem({ item, noBorder }) {
  return (
    <TouchableOpacity style={styles.container}>
      <Image
        source={require("../../../assets/icon.png")}
        style={[styles.image, { height: hp(6), width: hp(6) }]}
      />

      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={[styles.headerText, { fontSize: hp(1.8) }]}>Nomi</Text>
          <Text style={[styles.lastMessagetime, { fontSize: hp(1.6) }]}>
            Time
          </Text>
        </View>
        <Text style={[styles.lastMessagetime, { fontSize: hp(1.6) }]}>
          Last Message
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(4),
    alignItems: "center",
    gap: wp(3),
    marginBottom: hp(4),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  image: {
    borderRadius: hp(3),
  },
  textContainer: {
    flex: 1,
    gap: hp(1),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontWeight: "bold",
    color: "#333333",
  },
  lastMessagetime: {
    color: "#333333",
  },
});
