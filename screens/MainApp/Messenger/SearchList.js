import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ChatItem from "./ChatItem";
import { database } from "../../../App";
import { getAuth } from "firebase/auth";
import { query, where, getDocs, collection } from "firebase/firestore";
import ChatSearch from "./ChatSearch";
import SearchItem from "./SearchItem";

export default function SearchList() {
  const auth = getAuth();
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");

  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (currentUserId) {
      getFriends();
    }
  }, [currentUserId]);

  const getFriends = async () => {
    const userRef = collection(database, "users");

    const currQ = query(userRef, where("userId", "==", currentUserId));
    const currQSnapshot = await getDocs(currQ);

    let currData = [];

    currQSnapshot.forEach((doc) => {
      currData.push({ ...doc.data() });
    });

    if (currData.length > 0) {
      setCurrentUser(currData[0]);
      const friendsList = currData[0].friends;
      if (friendsList) {
        let friendData = [];
        for (const friendId of friendsList) {
          const getFriendQ = query(userRef, where("userId", "==", friendId));
          const getFriendQSnapShot = await getDocs(getFriendQ);
          getFriendQSnapShot.forEach((doc) => {
            friendData.push({ ...doc.data() });
          });
        }
        setFriends(friendData);
      }
    }
  };

  const data = friends.filter((friend) => friend.username.includes(search));

  return (
    <View style={styles.container}>
      <ChatSearch setSearch={setSearch} />
      <FlatList
        data={data}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <SearchItem
            noBorder={index + 1 == friends.length}
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
