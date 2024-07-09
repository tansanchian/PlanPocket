import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

const ChatRoomHeader = ({ name }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChatList")}
          style={styles.iconContainer}
        >
          <Ionicons name="arrow-back" size={20} />
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
            marginLeft: 12,
            fontSize: 17,
            fontWeight: "bold",
          }}
        >
          {name}
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
export default ChatRoomHeader;
