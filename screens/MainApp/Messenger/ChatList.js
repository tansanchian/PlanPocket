import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ChatItem from "./ChatItem";
import { database } from "../../../App";
import { getAuth } from "firebase/auth";
import { query, where, getDocs, collection, or } from "firebase/firestore";
import ChatListHeader from "./ChatListHeader";

export default function ChatList() {
  const auth = getAuth();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  useEffect(() => {
    if (auth.currentUser.uid) getUsers();
  }, []);
  const getUsers = async () => {
    const userRef = collection(database, "users");

    const q = query(userRef, where("userId", "!=", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    const currQ = query(userRef, where("userId", "==", auth.currentUser.uid));
    const currQSnapshot = await getDocs(currQ);

    let data = [];
    let currData = [];

    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data() });
    });

    setUsers(data);
    console.log("got users: ", data);

    currQSnapshot.forEach((doc) => {
      currData.push({ ...doc.data() });
    });

    setCurrentUser(currData);
    console.log("got currUser: ", currData);
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
