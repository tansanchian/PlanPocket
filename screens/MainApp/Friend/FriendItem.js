import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { getDatabase, ref, child, get } from "firebase/database";

const FriendItem = ({ friend }) => {
  const [imageUri, setImageUri] = useState(
    "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
  );

  useEffect(() => {
    const fetchImage = async () => {
      const dbRef = ref(getDatabase());
      try {
        const snapshot = await get(
          child(dbRef, `users/${friend.userId}/Profile/imageUrl`)
        );
        if (snapshot.exists() && snapshot.val() !== "") {
          setImageUri(snapshot.val());
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchImage();
  }, [friend.userId]);

  return (
    <View style={styles.friendContainer}>
      <Image source={{ uri: imageUri }} style={styles.profileImage} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friend.username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  friendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FriendItem;
