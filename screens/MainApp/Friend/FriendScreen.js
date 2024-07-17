import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView
} from "react-native";
import {
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from '@react-navigation/native';
import { database } from "../../../App";
import FriendHeader from "../Friend/FriendHeader";
import FriendItem from "./FriendItem";

const FriendScreen = () => {
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [count, setCount] = useState(0);
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

    currQSnapshot.forEach((doc) => {
      currData = { ...doc.data(), id: doc.id };
    });
    setCount(currData.friendRequests.length);

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
    } else {
      setFriendList([]);
    }
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser) {
        getUsers();
      }
    }, [auth.currentUser])
  );

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
      <FriendHeader count={count}/>
      <View style={styles.main}>
        {friendList.length === 0 ? (
         <ScrollView
         contentContainerStyle={styles.emptyContainer}
         refreshControl={
           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
         }
       >
         <Text style={styles.text}>No Friends</Text>
       </ScrollView>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Your Friends</Text>
            <FlatList
              data={friendList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <FriendItem friend={item} />}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
      </View>
    </View>
  );
};

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
  listContainer: {
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    textAlign: "center",
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f3eef6",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
});

export default FriendScreen;
