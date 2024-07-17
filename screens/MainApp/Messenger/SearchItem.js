import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { ref, getDatabase, get, child } from "firebase/database";
import { useState, useEffect } from "react";

export default function SearchItem({ item, noBorder, currentUser }) {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(
    "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
  );
  const handleUserPress = () => {
    const sortedUsernames = [currentUser.userId, item.userId].sort();
    const id = sortedUsernames.join("-");
    const username = item.username;
    const dataToSend = {
      chatId: id,
      username: username,
    };
    console.log("Data to send:", dataToSend);
    navigation.navigate("Messenger", {
      data: [dataToSend],
    });
  };
  useEffect(() => {
    const fetchImage = async () => {
      const dbRef = ref(getDatabase());
      try {
        const snapshot = await get(
          child(dbRef, `users/${item.userId}/Profile/imageUrl`)
        );
        if (snapshot.exists() && snapshot.val() !== "") {
          setImageUri(snapshot.val());
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchImage();
  }, [item.userId]);

  return (
    <TouchableOpacity
      onPress={handleUserPress}
      style={[styles.container, noBorder && { borderBottomWidth: 0 }]}
    >
      <Image
        source={{ uri: imageUri }}
        style={[styles.image, { height: hp(6), width: hp(6) }]}
      />
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={[styles.headerText, { fontSize: hp(1.8) }]}>
            {item.username}
          </Text>
        </View>
        <Text style={[styles.lastMessagetime, { fontSize: hp(1.6) }]}>
          Say Hi 👋;
        </Text>
      </View>
    </TouchableOpacity>
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
});
