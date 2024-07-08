import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import ChatItem from "./ChatItem";
import { database } from "../../../App";
import { getAuth } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import ChatListHeader from "./ChatListHeader";

export default function ChatList() {
  const auth = getAuth();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const currentUserId = auth.currentUser.uid;

  const filterExistingChatIds = async (friends) => {
    const validChatIds = await Promise.all(
      friends.map(async (friend) => {
        const sortedUsernames = [currentUserId, friend.userId].sort();
        const id = sortedUsernames.join("-");
        const collectionRef = collection(database, id);
        const q = query(collectionRef);

        return new Promise((resolve) => {
          onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
              resolve({ id, friend });
            } else {
              resolve(null);
            }
          });
        });
      })
    );

    return validChatIds.filter((chat) => chat !== null);
  };

  const getFriends = () => {
    const userRef = collection(database, "users");
    const currQ = query(userRef, where("userId", "==", currentUserId));

    return onSnapshot(currQ, async (querySnapshot) => {
      const currData = [];
      querySnapshot.forEach((doc) => {
        currData.push({ ...doc.data() });
      });

      if (currData.length > 0) {
        setCurrentUser(currData[0]);
        const friendData = [];
        await Promise.all(
          currData[0].friends.map(async (friendId) => {
            const getFriendQ = query(userRef, where("userId", "==", friendId));
            return new Promise((resolve) => {
              onSnapshot(getFriendQ, (friendSnapshot) => {
                friendSnapshot.forEach((doc) => {
                  friendData.push({ ...doc.data() });
                });
                resolve();
              });
            });
          })
        );

        const chatIdData = await filterExistingChatIds(friendData);
        setUsers(chatIdData);
      } else {
        setUsers([]);
      }
    });
  };

  useEffect(() => {
    if (currentUserId) {
      const unsubscribe = getFriends();
      return unsubscribe;
    }
  }, [currentUserId]);

  return (
    <View style={styles.container}>
      <ChatListHeader />
      {users.length > 0 ? (
        <>
          <FlatList
            data={users}
            contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <ChatItem
                noBorder={index + 1 === users.length}
                item={item}
                currentUser={currentUser}
              />
            )}
          />
        </>
      ) : (
        <View
          style={{
            flex: 1,
            paddingVertical: 25,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Text
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}
          >
            Welcome to Plan<Text style={{ color: "#735DA5" }}>Pocket</Text>
          </Text>
          <Text style={{ textAlign: "center", fontSize: 15 }}>
            Start messaging by tapping the search icon at the top right corner.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
