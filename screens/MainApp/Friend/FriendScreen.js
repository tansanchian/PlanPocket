import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getAuth } from "firebase/auth";
import {
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
  onSnapshot,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import { database } from "../../../App";
import FriendHeader from "../Friend/FriendHeader";
import FriendItem from "./FriendItem";

const FriendScreen = () => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const auth = getAuth();

  const getUsers = async () => {
    const userRef = collection(database, "users");

    const q = query(userRef, where("userId", "!=", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    const currQ = query(userRef, where("userId", "==", auth.currentUser.uid));
    const currQSnapshot = await getDocs(currQ);

    let data = [];
    let currData = {};

    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    setUsers(data);

    currQSnapshot.forEach((doc) => {
      currData = { ...doc.data(), id: doc.id };
    });
    setUser(currData);

    if (currData.friends && currData.friends.length > 0) {
      let friendsL = [];
      for (let i = 0; i < currData.friends.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (data[j].userId === currData.friends[i]) {
            friendsL.push(data[j]);
            break;
          }
        }
      }
      setFriendList(friendsL);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (auth.currentUser) {
      getUsers();
    }
  }, [auth.currentUser]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getUsers();
    setRefreshing(false);
  };

  const acceptFriendRequest = async (fromUserId) => {
    try {
      const newFriendList = [...user.friends, fromUserId];
      const userRef = doc(database, "users", user.userId);
      await updateDoc(userRef, {
        friends: newFriendList,
        friendRequests: arrayRemove(fromUserId),
      });

      const friendRef = doc(database, "users", fromUserId);
      await updateDoc(friendRef, {
        friends: arrayUnion(user.userId),
      });

      await getUsers();
      Alert.alert("Success", "Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FriendHeader />
      <Text style={styles.sectionTitle}>All Friends</Text>
      <FlatList
        data={friendList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FriendItem friend={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  searchInput: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
});

export default FriendScreen;
