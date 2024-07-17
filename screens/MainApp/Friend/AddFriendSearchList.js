import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { database } from "../../../App";
import { getAuth } from "firebase/auth";
import { query, where, getDocs, collection } from "firebase/firestore";
import AddFriendSearchItem from "./AddFriendSearchItem";
import AddFriendSearchHeader from "./AddFriendSearchHeader";
import PendingFriendItem from "./PendingFriendItem";

export default function AddFriendSearchList() {
  const auth = getAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState([]);

  const currentUserId = auth.currentUser?.uid;

  const getUsers = useCallback(async () => {
    if (!currentUserId) return;

    const userRef = collection(database, "users");

    const userQ = query(userRef, where("userId", "==", currentUserId));
    const userQSnapshot = await getDocs(userQ);
    let currentUserData = {};

    userQSnapshot.forEach((doc) => {
      currentUserData = { ...doc.data(), id: doc.id };
    });

    const currentUserFriends = currentUserData.friends || [];
    const currentUserPending = currentUserData.pending || [];

    const usersQ = query(userRef, where("userId", "!=", currentUserId));
    const usersQSnapshot = await getDocs(usersQ);

    let allUsersData = [];

    usersQSnapshot.forEach((doc) => {
      allUsersData.push({ ...doc.data(), id: doc.id });
    });

    let nonFriendUsers = allUsersData.filter(
      (user) =>
        !currentUserFriends.includes(user.userId) &&
        !currentUserPending.includes(user.userId)
    );
    let pendingUsers = allUsersData.filter((user) =>
      currentUserPending.includes(user.userId)
    );

    setUsers(nonFriendUsers);
    setPending(pendingUsers);
  }, [currentUserId]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const data = users.filter((user) => user.username.includes(search));

  return (
    <View style={styles.container}>
      <View style={styles.inviteList}>
        <AddFriendSearchHeader setSearch={setSearch} />
        <FlatList
          data={data}
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 25 }}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <AddFriendSearchItem
              noBorder={index + 1 === users.length}
              item={item}
              currentUser={currentUserId}
              getUsers={getUsers}
            />
          )}
        />
      </View>
      <View style={styles.pendingList}>
        <Text style={styles.text}>Pending Approval</Text>
        <FlatList
          data={pending}
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 25 }}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <PendingFriendItem
              noBorder={index + 1 === pending.length}
              item={item}
              currentUser={currentUserId}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inviteList: {
    flex: 0.6,
    backgroundColor: "white",
  },
  pendingList: {
    backgroundColor: "#f3eef6",
    flex: 0.4,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    paddingTop: 15,
    paddingLeft: 15,
  },
});
