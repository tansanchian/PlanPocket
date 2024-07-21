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
import SharedPurposeDirectly from "./SharedPurposeDirectly";

const MessengerScreen = ({ route }) => {
  const { data, item } = route.params;
  const username = data[0].username;
  const chatId = data[0].chatId;

  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const auth = getAuth();

  const formatTimestamp = (timestamp) => {
    const dateInput = new Date(timestamp);
    const date = new Date(dateInput.getTime() - 8 * 60 * 60 * 1000);

    const formatTime12Hour = (date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
    };

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
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

    const dayOfWeek = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const day = date.getDate();
    const time = formatTime12Hour(date);

    const formattedDate = `${dayOfWeek}, ${monthName} ${day}, ${time} (local time)`;

    return formattedDate;
  };

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
        text: "Check out this event! 🗓",
        user: {
          _id: auth?.currentUser?.uid,
          name: username,
          avatar: imageUrl,
        },
        custom: {
          isCustom: true,
          schedule: {
            fromDate: purpose.fromTime,
            toDate: purpose.toTime,
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

  const onAddSchedulePress = async (messageData) => {
    navigation.navigate("SharedCustomDateScreen", { messageData });
  };

  const onAddDirectlySchedulePress = async (messageData) => {
    try {
      const result = await SharedPurposeDirectly({ messageData });
      if (result == null) {
        return navigation.navigate("SharedPurposeDirectlyIfNull", {
          messageData,
        });
      }
      Alert.alert("Success", "Purpose added successfully");
    } catch (e) {
      console.error("Error addScheduledPressed", e);
    }
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
                onAddDirectlySchedulePress(messageData);
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
          style={[
            styles.eventCard,
            { alignSelf: isOutgoing ? "flex-end" : "flex-start" },
          ]}
        >
          <Text style={styles.eventTitle}>{currentMessage.text}</Text>
          {currentMessage.custom.schedule && (
            <View style={styles.eventDetails}>
              <Text style={styles.eventText}>
                <Text style={styles.eventLabel}>Date: </Text>
                {formatTimestamp(currentMessage.custom.schedule.fromDate)}
              </Text>
              {currentMessage.custom.schedule.events.map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <Text style={styles.eventText}>
                    <Text style={styles.eventLabel}>Category: </Text>
                    {event.category}
                  </Text>
                  <Text style={styles.eventText}>
                    <Text style={styles.eventLabel}>Purpose: </Text>
                    {event.purpose}
                  </Text>
                  {event.description && (
                    <Text style={styles.eventText}>
                      <Text style={styles.eventLabel}>Description: </Text>
                      {event.description}
                    </Text>
                  )}
                  <Text style={styles.eventText}>
                    <Text style={styles.eventLabel}>Costs: </Text>${event.cost}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddSchedule(messageData)}
          >
            <Text style={styles.addButtonText}>Add</Text>
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
            backgroundColor: "#E8ECEF",
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
  eventCard: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
  eventTitle: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  eventDetails: {
    marginBottom: 10,
  },
  eventText: {
    color: "#555",
    fontSize: 14,
    marginBottom: 5,
  },
  eventLabel: {
    fontWeight: "bold",
  },
  eventItem: {
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#735DA5",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});