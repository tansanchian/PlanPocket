import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getDatabase, ref, child, get } from "firebase/database";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const AcceptFriendItem = ({ friend, onAccept, noBorder }) => {
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

  const handleAccept = () => {
    onAccept(friend.userId);
  };

  return (
    <View
      style={[styles.friendContainer, noBorder && { borderBottomWidth: 0 }]}
    >
      <Image source={{ uri: imageUri }} style={styles.profileImage} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friend.username}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAccept}>
        <Text style={styles.text}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  friendContainer: {
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
    gap: hp(2),
  },
  friendName: {
    fontSize: 16,
    fontWeight: "bold",
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

export default AcceptFriendItem;
