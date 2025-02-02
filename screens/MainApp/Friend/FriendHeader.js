import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import IconWithBadge from "../../../components/IconWithBadge";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const FriendHeader = ({ count }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("FriendAcceptingScreen")}
          style={styles.iconContainer}
        >
          <IconWithBadge
            name="notifications-outline"
            size={24}
            badgeCount={count}
            color="#000"
          />
        </TouchableOpacity>
        <View>
          <Image
            source={require("../../../assets/icon.png")}
            style={[
              styles.image,
              { height: hp(4.5), aspectRatio: 1, borderRadius: 100 },
            ]}
          />
        </View>
        <Text
          style={{
            marginLeft: 13,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Plan<Text style={{ color: "#735DA5" }}>Pocket</Text>
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("AddFriendSearchList")}
        style={styles.iconContainer}
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

export default FriendHeader;
