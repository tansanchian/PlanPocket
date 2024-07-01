import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, {
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import { StatusBar } from "expo-status-bar";
import { GiftedChat } from "react-native-gifted-chat";
import { readProfile } from "../../components/Database";
import { getAuth } from "firebase/auth";
import Header from "../../components/Header"; // Assuming this is a custom component

const MessengerScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const loadItems = async () => {
      try {
        await readProfile("username", (value) => {
          console.log("Username:", value);
          setUsername(value);
        });
        await readProfile("imageUrl", (value) => {
          console.log("Image URL:", value);
          setImageUrl(value);
        });
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    loadItems();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <View style={{ marginLeft: 20 }}></View>,
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={signOutNow}
        >
          <Text>logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (username && imageUrl) {
      setMessages([
        {
          _id: 1,
          text: "Hello " + username,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: imageUrl,
          },
        },
      ]);
    }
  }, [username, imageUrl]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
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
            _id: user?.uid,
            name: username,
            avatar: imageUrl,
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
