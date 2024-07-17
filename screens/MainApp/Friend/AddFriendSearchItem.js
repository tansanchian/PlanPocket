import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getDatabase, ref, get, child } from "firebase/database";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { database } from "../../../App";

export default function AddFriendSearchItem({
  item,
  noBorder,
  currentUser,
  getUsers,
}) {
  const sendFriendRequest = async (friend) => {
    try {
      const friendRef = doc(database, "users", friend.userId);
      await updateDoc(friendRef, {
        friendRequests: arrayUnion(currentUser),
      });
      return true;
    } catch (error) {
      console.error("Error sending friend request:", error);
      return false;
    }
  };

  const addPending = async (friend) => {
    try {
      const userRef = doc(database, "users", currentUser);
      await updateDoc(userRef, {
        pending: arrayUnion(friend.userId),
      });
      return true;
    } catch (error) {
      console.error("Error adding pending friend:", error);
      return false;
    }
  };

  const handleSendFriendRequest = async () => {
    if (item) {
      const sent = await sendFriendRequest(item);
      const sent2 = await addPending(item);
      await getUsers();
      if (sent && sent2) {
        Alert.alert("Success", `Friend request sent to "${item.username}"!`);
      } else {
        Alert.alert(
          "Error",
          "Failed to send friend request. Please try again."
        );
      }
    } else {
      Alert.alert("Error", "Please enter a valid username.");
    }
  };

  const [imageUri, setImageUri] = useState(
    "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
  );

  useEffect(() => {
    const fetchImage = async () => {
      const dbRef = ref(getDatabase());
      try {
        const snapshot = await get(
          child(dbRef, `users/${item.userId}/Profile/imageUrl`)
        );
        if (snapshot.exists() && snapshot.val() !== "") {
          setImageUri(snapshot.val());
        } else {
          console.log("No image URL found in Firebase or it is empty.");
        }
      } catch (error) {
        console.error("Error fetching image URL from Firebase:", error);
      }
    };

    fetchImage();
  }, [item.userId]);

  return (
    <View style={[styles.container, noBorder && { borderBottomWidth: 0 }]}>
      <Image
        source={{ uri: imageUri }}
        style={[styles.image, { height: hp(6), width: hp(6) }]}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.headerText, { fontSize: hp(1.8) }]}>
          {item.username}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSendFriendRequest}>
        <Text style={styles.text}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(4),
    alignItems: "center",
    gap: wp(3),
    marginBottom: hp(4),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
  },
  image: {
    borderRadius: hp(3),
  },
  textContainer: {
    flex: 1,
    gap: hp(1),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontWeight: "bold",
    color: "#333333",
  },
  lastMessagetime: {
    color: "#333333",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    backgroundColor: "#735DA5",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
