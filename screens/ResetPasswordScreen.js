import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useNavigation } from "@react-navigation/native";

export default function FogotPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const navigation = useNavigation();

  const onSubmitPressed = () => {
    console.warn("onSubmitPressed");
    navigation.navigate("SignIn");
  };
  const onSignInPressed = () => {
    console.warn("onSignInPressed");
    navigation.navigate("SignIn");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={styles.title}>Reset your password</Text>
        <CustomInput placeholder="Code" value={code} setValue={setCode} />
        <CustomInput
          placeholder="Enter your new password"
          value={newPassword}
          setValue={setNewPassword}
        />
        <CustomButton text="Submit" onPress={onSubmitPressed} />
        <CustomButton
          text="Back to Sign in"
          onPress={onSignInPressed}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 50,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
});
