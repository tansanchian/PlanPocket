import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
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

  useEffect(() => {
    if (currentUserId) {
      const unsubscribe = getFriends();
      return unsubscribe;
    }
  }, [currentUserId]);

  const getFriends = () => {
    const userRef = collection(database, "users");
    const currQ = query(userRef, where("userId", "==", currentUserId));

    return onSnapshot(currQ, (querySnapshot) => {
      let currData = [];
      querySnapshot.forEach((doc) => {
        currData.push({ ...doc.data() });
      });

      if (currData.length > 0) {
        setCurrentUser(currData[0]);
        let friendData = [];
        currData[0].friends.forEach((friendId) => {
          const getFriendQ = query(userRef, where("userId", "==", friendId));
          const unsubscribe = onSnapshot(getFriendQ, (friendSnapshot) => {
            friendSnapshot.forEach((doc) => {
              friendData.push({ ...doc.data() });
            });

            const chatIdData = filterExistingChatIds(friendData);
            setUsers(chatIdData);
          });
        });
        return () => friendData.forEach(unsubscribe);
      } else {
        setUsers([]);
      }
    });
  };

  const filterExistingChatIds = (friends) => {
    let validChatIds = [];
    friends.forEach((friend) => {
      const sortedUsernames = [currentUserId, friend.userId].sort();
      const id = sortedUsernames.join("-");
      const collectionRef = collection(database, id);
      const q = query(collectionRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          validChatIds.push({ id, friend });
        } else {
          validChatIds = validChatIds.filter((chat) => chat.id !== id);
        }
        setUsers([...validChatIds]);
      });
    });
  };

  return (
    <View style={styles.container}>
      <ChatListHeader />
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatItem
            noBorder={index + 1 == users.length}
            item={item}
            currentUser={currentUser}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
