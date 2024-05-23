import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { globalStyles } from "../styles/global";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { auth } from "../App";
import { signInWithEmailAndPassword } from "@firebase/auth";

export default function SignInScreen() {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const password = watch("password");
  const email = watch("email");

  const onSignInPressed = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("HomeScreen");
      console.log(response);
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
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
            name="email"
            placeholder="Email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            }}
          />
          <CustomInput
            name="password"
            placeholder="Password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 3,
                message: "Password should be minium 3 characters",
              },
            }}
            secureTextEntry={true}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <CustomButton
              text="Sign In"
              onPress={handleSubmit(onSignInPressed)}
            />
          )}
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
