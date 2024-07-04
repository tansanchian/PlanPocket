import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

export default function ChatItem({ item, noBorder, currentUser }) {
  const navigation = useNavigation();
  const handleUserPress = () => {
    const sortedUsernames = [currentUser[0].username, item.username].sort();
    const id = sortedUsernames.join("-");

    const username = item.username;
    const dataToSend = {
      chatId: id,
      username: username,
    };
    console.log("Data to send:", dataToSend);
    navigation.navigate("Messenger", {
      data: [dataToSend],
    });
  };

  return (
    <TouchableOpacity
      onPress={handleUserPress}
      style={[styles.container, noBorder && { borderBottomWidth: 0 }]}
    >
      <Image
        source={require("../../../assets/icon.png")}
        style={[styles.image, { height: hp(6), width: hp(6) }]}
      />
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={[styles.headerText, { fontSize: hp(1.8) }]}>
            {item.username}
          </Text>
        </View>
        <Text style={[styles.lastMessagetime, { fontSize: hp(1.6) }]}>
          Say Hi 👋;
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
