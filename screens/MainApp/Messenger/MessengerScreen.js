import { View, StyleSheet, Platform } from "react-native";
import React, {
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import { StatusBar } from "expo-status-bar";
import { GiftedChat } from "react-native-gifted-chat";
import { readProfile } from "../../../components/Database";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { database } from "../../../App";
import { useNavigation } from "@react-navigation/native";
import ChatRoomHeader from "./ChatRoomHeader";

const MessengerScreen = ({ route }) => {
  const { data } = route.params;
  const username = data[0].username;
  const chatId = data[0].chatId;

  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [lastMessage, setLastMessage] = useState(undefined);
  const auth = getAuth();

  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats" + chatId);
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => doc.data());
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });
    console.log(lastMessage);
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, "chats" + chatId), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ChatRoomHeader name={username} />
      <View style={styles.internalContainer}>
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={true}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: auth?.currentUser?.email,
            name: "abc",
            avatar: imageUrl,
          }}
          messagesContainerStyle={{
            backgroundColor: "#fff",
          }}
        />
      </View>
    </View>
  );
};

export default MessengerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  internalContainer: {
    flex: 1,
    paddingBottom: Platform.OS === "ios" ? 90 : 60,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    justifyContent: "center",
    margin: 10,
  },
});
