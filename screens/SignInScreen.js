import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { globalStyles } from "../styles/global";
import { useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useNavigation } from "@react-navigation/native";

export default function SignInScreen() {
  const { height } = useWindowDimensions();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const onSignInPressed = () => {
    console.warn("Sign in");
    navigation.navigate("HomeScreen");
  };
  const onSignInGoogle = () => {
    console.warn("onSignInGoogle");
  };
  const onSignInFacebook = () => {
    console.warn("onSignInFaceBook");
  };
  const onForgotPasswordPressed = () => {
    console.warn("onForgotPasswordPressed");
    navigation.navigate("ForgotPassword");
  };
  const onSignUpPressed = () => {
    console.warn("onSignUpPressed");
    navigation.navigate("SignUp");
  };

  // const validateForm = () => {
  //   let errors = {};

  //   if (!username) errors.username = "Username is required";
  //   if (!password) errors.password = "Password is required";

  //   setErrors(errors);

  //   return Object.keys(errors).length === 0;
  // };

  // const handleSubmit = () => {
  //   if (validateForm()) {
  //     console.log("Submitted", username, password);
  //     setUsername("");
  //     setPassword("");
  //     setErrors({});
  //   }
  //         {/* {errors.username && (
  //           <Text style={styles.errorText}>{errors.username}</Text>
  //         )}
  //         {errors.password && (
  //           <Text style={styles.errorText}>{errors.password}</Text>
  //         )} */}
  // };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={globalStyles.container}
      >
        <View style={styles.form}>
          <Image
            source={require("../assets/Logo.png")}
            style={(styles.img, { height: height * 0.3 })}
            resizeMode="contain"
          />
          <CustomInput
            placeholder="Username"
            value={username}
            setValue={setUsername}
            secureTextEntry={false}
          />
          <CustomInput
            placeholder="Password"
            value={password}
            setValue={setPassword}
            secureTextEntry={true}
          />
          <CustomButton text="Sign In" onPress={onSignInPressed} />
          <CustomButton
            text="Forgot password?"
            onPress={onForgotPasswordPressed}
            type="TERTIARY"
          />
          <CustomButton
            text="Sign In with Google"
            onPress={onSignInGoogle}
            bgColor="#FAE9EA"
            fgColor="#DD4D44"
          />
          <CustomButton
            text="Sign In with Facebook"
            onPress={onSignInFacebook}
            bgColor="#FAE9EA"
            fgColor="#DD4D44"
          />
          <CustomButton
            text="Don't have an account? Create one"
            onPress={onSignUpPressed}
            type="TERTIARY"
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: "#F9FBFC",
    padding: 20,
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: 100,
    maxWidth: 300,
    maxHeight: 200,
  },
});
