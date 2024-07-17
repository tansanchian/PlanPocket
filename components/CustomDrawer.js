import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  useWindowDimensions,
} from "react-native";
import React, { useContext } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthContext";

const CustomDrawer = (props) => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const onLogOutPressed = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
  };

  const onAboutPressed = () => {
    navigation.navigate("AboutUs");
  };

  const { height, width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.content}
      >
        <ImageBackground
          source={{
            uri: "https://img.freepik.com/free-photo/abstract-splash-violet-paint_23-2147809147.jpg?t=st=1717315881~exp=1717316481~hmac=3c32c7ccc1a8e71fa22b60734bd08c836b28f810ffb77009a359458116f2fa13",
          }}
          style={styles.bgImage}
        >
          <Image
            source={{ uri: props.imageUri }}
            style={[
              styles.image,
              {
                height: height * 0.1,
                width: height * 0.1,
                borderRadius: (height * 0.1) / 2,
              },
            ]}
          />
          <Text style={styles.username}>{props.username}</Text>
        </ImageBackground>
        <View style={styles.list}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.custom}>
        <TouchableOpacity
          onPress={onAboutPressed}
          style={{ paddingVertical: 15 }}
        >
          <View style={styles.customBotton}>
            <AntDesign name="book" size={20} />
            <Text style={{ marginLeft: 5, fontWeight: "bold" }}>About Us</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onLogOutPressed}
          style={{ paddingVertical: 15 }}
        >
          <View style={styles.customBotton}>
            <AntDesign name="logout" size={20} />
            <Text style={{ marginLeft: 5, fontWeight: "bold" }}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: "white",
  },
  bgImage: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    resizeMode: "cover",
  },
  image: {
    borderRadius: 50,
    borderColor: "#735DA5",
    borderWidth: 1,
  },
  username: {
    padding: 10,
    color: "black",
    left: 12,
  },
  list: {
    marginTop: 10,
  },
  custom: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "grey",
  },
  customBotton: {
    flexDirection: "row",
    alignItems: "center",
  },
});
