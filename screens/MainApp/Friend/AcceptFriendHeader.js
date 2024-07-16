import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const AcceptFriendHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconContainer}
        >
          <Ionicons name="arrow-back" size={20} />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 13,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Friend<Text style={{ color: "#735DA5" }}> Requests</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    maxHeight: 65,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  iconContainer: {
    marginHorizontal: 16,
    height: 45,
    width: 45,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 24,
    width: 24,
    tintColor: "black",
  },
});
export default AcceptFriendHeader;