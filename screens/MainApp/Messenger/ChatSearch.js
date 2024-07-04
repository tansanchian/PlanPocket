import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";

const ChatSearch = ({ setSearch }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChatList")}
          style={styles.iconContainer}
        >
          <AntDesign name="left" size={20} />
        </TouchableOpacity>
        <TextInput
          placeholder="Search"
          onChangeText={(text) => setSearch(text)}
        ></TextInput>
      </View>
      <TouchableOpacity onPress={() => {}} style={styles.iconContainer}>
        <AntDesign name="bars" size={20} />
      </TouchableOpacity>
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
    backgroundColor: "#f3eef6",
  },
  icon: {
    height: 24,
    width: 24,
    tintColor: "black",
  },
});
export default ChatSearch;
