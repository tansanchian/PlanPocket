import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ChatListHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={styles.iconContainer}
          testID="drawer-icon"
        >
          <AntDesign name="bars" size={20} />
        </TouchableOpacity>
        <View>
          <Image
            source={require("../../../assets/icon.png")}
            style={[
              styles.image,
              { height: hp(4.5), aspectRatio: 1, borderRadius: 100 },
            ]}
            testID="header-image"
          />
        </View>
        <Text
          style={{
            marginLeft: 13,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
          testID="header-text"
        >
          Plan<Text style={{ color: "#735DA5" }}>Pocket</Text>
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("SearchList")}
        style={styles.iconContainer}
        testID="search-icon"
      >
        <Ionicons name="search" size={20} />
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
export default ChatListHeader;
