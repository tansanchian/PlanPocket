import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { database } from "../../../App";
import AcceptFriendHeader from "./AcceptFriendHeader";
import { StatusBar } from "expo-status-bar";
import AcceptFriendItem from "./AcceptFriendItem";

export default function FriendRequestList() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser.uid;

  const getUsers = async () => {
    const userRef = collection(database, "users");
    const currQ = query(userRef, where("userId", "==", userId));
    const currQSnapshot = await getDocs(currQ);

    let currData = {};

    currQSnapshot.forEach((doc) => {
      currData = { ...doc.data(), id: doc.id };
    });
    setUser(currData);

    setIsLoading(false);
  };

  const getFriendItem = async (userId) => {
    const userRef = collection(database, "users");
    const currQ = query(userRef, where("userId", "==", userId));
    const currQSnapshot = await getDocs(currQ);

    let currData = {};

    currQSnapshot.forEach((doc) => {
      currData = { ...doc.data(), id: doc.id };
    });
    return currData;
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
        const index = friendRequests.indexOf(fromUserId);
          const temp = friendRequests.splice(index, 1);
        setFriendRequests(temp);
      await getUsers();
      Alert.alert("Success", "Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const unsubscribe = onSnapshot(doc(database, "users", userId), async (doc) => {
        const data = doc.data();
        const requests = data.friendRequests || [];
        const requestDetails = await Promise.all(
          requests.map(async (requestId) => await getFriendItem(requestId))
        );
        setFriendRequests(requestDetails);
      });
      getUsers();
      return () => unsubscribe();
    };

    fetchFriendRequests();
  }, [userId]);

  const handleAcceptRequest = async (fromUserId) => {
    const accepted = await acceptFriendRequest(fromUserId);
    if (accepted) {
      Alert.alert("Success", "Friend request accepted!");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

    const renderItem = ({ item }) => {  
        return <TouchableOpacity onPress={handleAcceptRequest}>
            <AcceptFriendItem friend={item} onAccept={handleAcceptRequest}/>
        </TouchableOpacity>
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AcceptFriendHeader />
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
