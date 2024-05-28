import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";

const Header = ({ title, onPress }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={styles.iconContainer}
        >
          <AntDesign name="bars" size={20} />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 12,
            fontSize: 17,
            fontWeight: "bold",
          }}
        >
          {title}
        </Text>
      </View>
      <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
        <AntDesign name="ellipsis1" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 16,
  },
  iconContainer: {
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
export default Header;
