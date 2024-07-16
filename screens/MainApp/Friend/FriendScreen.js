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
  onSnapshot,
  setDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { database } from "../../../App";
import FriendItem from "./FriendItem";
import FriendHeader from "../Friend/FriendHeader";

const FriendScreen = () => {
  const [friendUsername, setFriendUsername] = useState("");
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
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

  const refreshFriendList = async () => {
    if (user.friends && user.friends.length > 0) {
      let friendsL = [];
      for (let i = 0; i < user.friends.length; i++) {
        for (let j = 0; j < users.length; j++) {
          if (users[j].userId === user.friends[i]) {
            friendsL.push(users[j]);
            break;
          }
        }
      }
      setFriendList(friendsL);
    }
  };

  const sendFriendRequest = async (friend) => {
    try {
      let check = "404";
      let friendData = null;
      for (const data of users) {
        if (friend === data.username) {
          check = "0";
          friendData = data;
        }
      }
      if (check === "404") {
        Alert.alert("Error", "User does not exist!");
        return false;
      }
      if (user.friends.includes(friendData.userId)) {
        Alert.alert("Error", "User is already your friend!");
        return false;
      }
      const friendRequests = friendData.friendRequests || [];
      if (friendRequests.includes(user.userId)) {
        Alert.alert("Error", "Pending acception!");
        return false;
      }
      const friendRef = doc(database, "users", friendData.userId);
      await updateDoc(friendRef, {
        friendRequests: arrayUnion(user.userId),
      });
      return true;
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleSendFriendRequest = async () => {
    if (friendUsername) {
      const sent = await sendFriendRequest(friendUsername);
      if (sent) {
        Alert.alert("Success", `Friend request sent to "${friendUsername}"!`);
        setFriendUsername("");
      }
    } else {
      Alert.alert("Error", "Please enter a valid username.");
    }
  };

  const acceptFriendRequest = async (fromUserId) => {
    try {
      user.friends.push(fromUserId);
      const userList = user.friends;

      const friendRef = doc(database, "users", fromUserId);
      const friendSnap = await getDoc(friendRef);
      const friendData = friendSnap.data();
      friendData.friends.push(user.userId);
      const friendList = friendData.friends;

      const userRef = doc(database, "users", user.userId);
      await updateDoc(userRef, {
        friends: userList,
        friendRequests: arrayRemove(fromUserId),
      });

      await updateDoc(friendRef, {
        friends: friendList,
      });

      await refreshFriendList();
      return true;
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const getUsername = (userId) => {
    const user = users.find((x) => x.userId === userId);
    return user ? user.username : "Unknown";
  };

  const FriendRequestList = ({ userId }) => {
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
      const unsubscribe = onSnapshot(doc(database, "users", userId), (doc) => {
        const data = doc.data();
        setFriendRequests(data.friendRequests || []);
      });
      return () => unsubscribe();
    }, [userId]);

    const handleAcceptRequest = async (fromUserId) => {
      const accepted = await acceptFriendRequest(fromUserId);
      if (accepted) {
        Alert.alert("Success", "Friend request accepted!");
      }
    };

    return (
      <View>
        {friendRequests.map((request) => (
          <View key={request} style={styles.requestItem}>
            <Text>{`Friend request from ${getUsername(request)}`}</Text>
            <Button
              title="Accept"
              onPress={() => handleAcceptRequest(request)}
            />
          </View>
        ))}
      </View>
    );
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
      <Button title="Send Friend Request" onPress={handleSendFriendRequest} />
      <Button title="Refresh" onPress={refreshFriendList} />
      <Text style={styles.sectionTitle}>Friend Requests</Text>
      <FriendRequestList userId={auth.currentUser.uid} />
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
