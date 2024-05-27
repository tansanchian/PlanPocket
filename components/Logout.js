import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthContext";
import React, { useContext } from "react";
import { Button } from "react-native";

export const Logout = () => {
  const navigation = useNavigation();

  const { logout } = useContext(AuthContext);

  const onLogOutPressed = () => {
    logout();
    navigation.navigate("SignIn");
  };
  return <Button title={"logout"} onPress={onLogOutPressed} />;
};
