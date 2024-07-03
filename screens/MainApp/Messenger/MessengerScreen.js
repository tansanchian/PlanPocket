import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
import Header from "../../../components/Header";
import { useNavigation } from "@react-navigation/native";

const MessengerScreen = ({ route }) => {
  const { user } = route.params;
  const { name } = user;
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const auth = getAuth();

  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats-" + name);
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("snapshot");
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, "chats-" + name), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.internalContainer}>
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={true}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: auth?.currentUser?.email,
            name: username,
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
    paddingBottom: 200,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    justifyContent: "center",
    margin: 10,
  },
});
