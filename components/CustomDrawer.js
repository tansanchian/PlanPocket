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

const onAboutPressed = () => {
  console.log("onAboutPressed");
};

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
  const { height, width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.content}
      >
        <ImageBackground
          source={require("../assets/menu.png")}
          style={styles.bgImage}
        >
          <Image
            source={require("../assets/Logo.png")}
            style={[styles.image, { height: height * 0.1, width: width * 0.2 }]}
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
    borderWidth: 2,
    maxWidth: 100,
    maxHeight: 100,
  },
  username: {
    padding: 10,
    color: "black",
    left: 12
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
