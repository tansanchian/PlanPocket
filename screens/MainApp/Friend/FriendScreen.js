import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Image,
} from "react-native";
import { getDocs, query, where, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
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
    
    setCount(currData.friendRequests != undefined ? currData.friendRequests.length : 0);

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
      <FriendHeader count={count} />
      <View style={styles.main}>
        {friendList.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.emptyContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: -200,
              }}
            >
              <Image source={require("../../../assets/noFriends.png")} />
              <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 15 }}>
                You have no contacts yet!
              </Text>
              <Text style={{ fontSize: 16 }}>
                Add friends from PlanPocket to see them here.
              </Text>
            </View>
          </ScrollView>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Your Friends</Text>
            <FlatList
              data={friendList}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <FriendItem
                  noBorder={index + 1 === friendList.length}
                  friend={item}
                />
              )}
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
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    flex: 1,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 25,
    padding: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
});

export default FriendScreen;
