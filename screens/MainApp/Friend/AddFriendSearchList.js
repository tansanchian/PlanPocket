import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { database } from "../../../App";
import { getAuth } from "firebase/auth";
import { query, where, getDocs, collection } from "firebase/firestore";
import AddFriendSearchItem from "./AddFriendSearchItem";
import AddFriendSearchHeader from "./AddFriendSearchHeader";

export default function AddFriendSearchList() {
  const auth = getAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const userRef = collection(database, "users");

    const usersQ = query(userRef, where("userId", "!=", currentUserId));
    const usersQSnapshot = await getDocs(usersQ);

    let currData = [];

    usersQSnapshot.forEach((doc) => {
      currData.push({ ...doc.data() });
    });

    setUsers(currData);
  };

  useEffect(() => {}, [users]);
  const data = users.filter((user) => user.username.includes(search));

  return (
    <View style={styles.container}>
      <AddFriendSearchHeader setSearch={setSearch} />
      <FlatList
        data={data}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <AddFriendSearchItem
            noBorder={index + 1 == users.length}
            item={item}
            currentUser={currentUserId}
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
