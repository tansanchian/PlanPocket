import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { database } from "../../../App";

export default function ChatItem({ item, noBorder, currentUser }) {
  const navigation = useNavigation();
  const [lastMessage, setLastMessage] = useState(undefined);
  const [id, setId] = useState("");

  const handleUserPress = () => {
    const sortedUsernames = [currentUser[0].username, item.username].sort();
    const id = sortedUsernames.join("-");
    setId(id);
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

  useEffect(() => {
    if (!id) return;

    const collectionRef = collection(database, "chats" + id);
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => doc.data());
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });

    return () => unsubscribe();
  }, [id]);

  const renderLastMessage = () => {
    if (!lastMessage) return "Say Hi 👋";
    const isCurrentUser = currentUser?._id === lastMessage?._id;
    console.log(lastMessage);
    return isCurrentUser ? `You: ${lastMessage.text}` : lastMessage.text;
  };

  const formatDate = (date) => {
    var day = date.getDate();
    var monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var month = monthNames[date.getMonth()];

    var formattedDate = day + " " + month;
    return formattedDate;
  };

  const renderLastTime = () => {
    if (lastMessage) {
      let date = lastMessage?.createdAt;
      return formatDate(new Date(date?.seconds * 1000));
    }
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
          <Text style={[styles.lastMessagetime, { fontSize: hp(1.6) }]}>
            {renderLastTime()}
          </Text>
        </View>
        <Text style={[styles.lastMessagetime, { fontSize: hp(1.6) }]}>
          {renderLastMessage()}
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
