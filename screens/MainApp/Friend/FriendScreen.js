import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
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
} from "firebase/firestore";
import { database } from "../../../App";
import FriendItem from "./FriendItem";

const FriendScreen = () => {
  const [friendUsername, setFriendUsername] = useState("");
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      console.log(friendsL);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (auth.currentUser) {
      getUsers();
    }
  }, [auth.currentUser]);

  const addFriend = async (friend) => {
    try {
      let check = "404";
      let friendData = null;
      for (const data of users) {
        if (friend == data.username) {
          check = "0";
          friendData = data;
        }
      }
      if (check == "404") {
        Alert.alert("Error", "User does not exist");
        return false;
      }
      for (const i of user.friends) {
        if (i == friendData.userId) {
          check = "402";
        }
      }
      if (check == "402") {
        Alert.alert("Error", "User is already your friend!");
        return false;
      }
      friendData.friends.push(user.userId);
      user.friends.push(friendData.userId);
      const friendList = friendData.friends;
      const userList = user.friends;
      const friendRef = doc(database, "users", friendData.userId);
      await updateDoc(friendRef, {
        friends: friendList,
      });
      const userRef = doc(database, "users", user.userId);
      await updateDoc(userRef, {
        friends: userList,
      });
      return true;
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleAddFriend = async () => {
    if (friendUsername) {
      const add = await addFriend(friendUsername);
      if (add) {
        Alert.alert("Success", `Friend "${friendUsername}" added!`);
        setFriendUsername("");
        getUsers(); // Refresh the users and friend list
      }
    } else {
      Alert.alert("Error", "Please enter a valid username.");
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
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={friendUsername}
        onChangeText={setFriendUsername}
      />
      <Button title="Add Friend" onPress={handleAddFriend} />
      <Text style={styles.sectionTitle}>All Friends</Text>
      <FlatList
        data={friendList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FriendItem friend={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 50,
  },
  searchInput: {
    height: 40,
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
});

export default FriendScreen;
