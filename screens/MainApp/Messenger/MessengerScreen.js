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
  Alert,
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
import ShareLogic from "../../../components/ShareLogic";
import { writeScheduleDatabase } from "../../../components/Database";
import CustomButton from "../../../components/CustomButton";

const MessengerScreen = ({ route }) => {
  const { data, item } = route.params;
  const username = data[0].username;
  const chatId = data[0].chatId;

  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const auth = getAuth();

  function formatTimeTo12Hour(dateTimeString) {
    return new Date(dateTimeString).toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

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
      const purpose = item.purposeValue;
      const purposeToDate = item.purposeToDate;
      const purposeFromDate = item.purposeFromDate;

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
            fromDate: purposeFromDate,
            toDate: purposeToDate,
            events: [
              {
                category: purpose.category,
                purpose: purpose.purpose,
                cost: purpose.costs,
                fromTime: purpose.fromTime,
                toTime: purpose.toTime,
                description: purpose.description,
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

    sendCustomPrompt(item);
  }, [auth?.currentUser?.uid, imageUrl, username, item, chatId]);

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
            <Ionicons name="calendar" size={20} color="gray" />
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

  const onAddSchedulePress = (messageData) => {
    navigation.navigate("SharedCustomDateScreen", { messageData });
  };

  const handleAddSchedule = async (messageData) => {
    try {
      const scheduleData = await ShareLogic(messageData);

      Alert.alert(
        "Add",
        "Are you sure you want to add this schedule?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              console.log("Schedule checker:", scheduleData);
              if (scheduleData) {
                onAddSchedulePress(messageData);
              } else {
                alert("You already have something going on");
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      Alert.alert("Error", "Failed to fetch schedule data.");
    }
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;

    if (currentMessage.custom && currentMessage.custom.isCustom) {
      const messageData = currentMessage.custom.schedule;
      const isOutgoing = currentMessage.user._id === auth?.currentUser?.uid;
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#dadada",
            borderRadius: 25,
            padding: 15,
            marginBottom: 10,
            marginTop: 10,
            alignSelf: isOutgoing ? "flex-end" : "flex-start",
          }}
        >
          <Text style={{ color: "#333", fontWeight: "bold", fontSize: 18 }}>
            {currentMessage.text}
          </Text>
          {currentMessage.custom.schedule && (
            <View>
              <Text style={{ color: "#333" }}>
                Date: {currentMessage.custom.schedule.fromDate} to{" "}
                {currentMessage.custom.schedule.toDate}
              </Text>
              {currentMessage.custom.schedule.events.map((event, index) => (
                <View>
                  <Text key={index} style={{ color: "#333" }}>
                    Category: {event.category}
                    {"\n"}
                    Purpose: {event.purpose} {"\n"}
                    {event.description && (
                      <>
                        Description: {event.description}
                        {"\n"}
                      </>
                    )}
                    Costs: ${event.cost} {"\n"}
                    Time: {formatTimeTo12Hour(event.fromTime)} to{" "}
                    {formatTimeTo12Hour(event.toTime)}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "black",
              paddingVertical: 10,
              paddingHorizontal: 50,
              borderRadius: 25,
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => handleAddSchedule(messageData)}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return <Bubble {...props} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ChatRoomHeader name={username} />
      <View style={styles.internalContainer}>
        <GiftedChat
          messages={messages}
          renderBubble={
            (renderBubble = (props) => {
              return (
                <Bubble
                  {...props}
                  textStyle={{
                    right: {
                      color: "pink",
                    },
                    left: {
                      color: "pink",
                    },
                  }}
                />
              );
            })
          }
          showAvatarForEveryMessage={true}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: auth?.currentUser?.uid,
            name: username,
            avatar: imageUrl,
          }}
          renderMessage={renderMessage}
          messagesContainerStyle={{
            padding: 10,
            backgroundColor: "white",
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
  },
  composerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 50,
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
