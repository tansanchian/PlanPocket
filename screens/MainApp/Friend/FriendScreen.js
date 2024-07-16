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
      <View style={styles.main}>
      <Text style={styles.sectionTitle}>All Friends</Text>
      <FlatList
        data={friendList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FriendItem friend={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  main: {
    backgroundColor: "#f3eef6",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    marginLeft: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3eef6",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});

export default FriendScreen;
