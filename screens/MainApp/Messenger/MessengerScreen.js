import React, {
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { GiftedChat, Composer, Bubble } from "react-native-gifted-chat";
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
import { Ionicons } from "@expo/vector-icons";

const MessengerScreen = ({ route }) => {
  const { data, item } = route.params;
  let sharedItem = item;
  console.log(sharedItem);
  const username = data[0].username;
  const chatId = data[0].chatId;

  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const auth = getAuth();

  useLayoutEffect(() => {
    const collectionRef = collection(database, chatId);
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          custom: doc.data().custom,
          schedule: doc.data().schedule,
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return () => unsubscribe();
  }, [chatId]);

  const onSend = useCallback(
    (messages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );

      const { _id, createdAt, text, user } = messages[0];
      addDoc(collection(database, chatId), {
        _id,
        createdAt,
        text,
        user,
        custom: {
          isCustom: false,
        },
      });
    },
    [chatId]
  );

  useEffect(() => {
    const sendCustomPrompt = (item) => {
      if (!item) {
        return;
      }

      const scheduleMessage = {
        _id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        text: "Here is my schedule",
        user: {
          _id: auth?.currentUser?.uid,
          name: username,
          avatar: imageUrl,
        },
        custom: {
          isCustom: true,
          schedule: {
            date: item.lastDateKey,
            events: [
              {
                category: item.category,
                purpose: item.purpose,
                cost: item.costs,
                fromTime: item.fromTimeString,
                toTime: item.toTimeString,
                description: item.description,
              },
            ],
          },
        },
      };

      addDoc(collection(database, chatId), scheduleMessage);

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [scheduleMessage])
      );

      sharedItem = null;
    };

    sendCustomPrompt(sharedItem);
  }, [auth?.currentUser?.uid, imageUrl, username, sharedItem, chatId]);

  const CustomComposer = (props) => {
    return (
      <View style={styles.composerContainer}>
        <View style={styles.textInputWrapper}>
          <TouchableOpacity
            style={styles.additionalButton}
            onPress={() => {
              navigation.navigate("ScheduleList", { data });
            }}
          >
            <Ionicons name="calendar" size={24} color="gray" />
          </TouchableOpacity>
          <Composer
            {...props}
            textInputStyle={styles.customTextInput}
            placeholder="Message"
            placeholderTextColor="gray"
          />
        </View>
      </View>
    );
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;
    if (currentMessage.custom && currentMessage.custom.isCustom) {
      return (
        <TouchableOpacity onPress={() => alert("Custom prompt pressed!")}>
          <View
            style={{
              backgroundColor: "#e6e6e6",
              borderRadius: 10,
              padding: 10,
              margin: 5,
            }}
          >
            <Text style={{ color: "#333", fontWeight: "bold" }}>
              {currentMessage.text}
            </Text>
            {currentMessage.custom.schedule && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ color: "#333" }}>
                  Date: {currentMessage.custom.schedule.date}
                </Text>
                {currentMessage.custom.schedule.events.map((event, index) => (
                  <View>
                    <Text key={index} style={{ color: "#333" }}>
                      Category: {event.category}
                      {"\n"}
                      Purpose: {event.purpose}
                      {event.description && (
                        <>
                          {"\n"}
                          Description: {event.description}
                        </>
                      )}
                      {"\n"}
                      Costs: {event.cost}
                      {"\n"}
                      Time: {event.fromTime} to {event.toTime}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }
    return <Bubble {...props} />;
  };

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
            _id: auth?.currentUser?.uid,
            name: username,
            avatar: imageUrl,
          }}
          renderMessage={renderMessage}
          messagesContainerStyle={{
            backgroundColor: "#fff",
            paddingBottom: 15,
          }}
          renderComposer={(props) => <CustomComposer {...props} />}
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
  composerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  customTextInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  additionalButton: {
    padding: 10,
  },
});
