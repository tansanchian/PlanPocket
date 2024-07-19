import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useContext } from "react";
import { globalStyles } from "../styles/global";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { auth } from "../App";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { AuthContext } from "../components/AuthContext";
import { StatusBar } from "expo-status-bar";

export default function SignInScreen() {
  const { height } = useWindowDimensions();
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSignInPressed = async (data) => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const customToken = await response.user.getIdToken();
      login(customToken);
      console.log(response);
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-credential") {
        alert("Sign in failed: incorrect password or username!");
      } else {
        alert("Sign in failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSignInGoogle = () => {
    console.warn("onSignInGoogle");
  };
  const onSignInFacebook = () => {
    console.warn("onSignInFacebook");
  };
  const onForgotPasswordPressed = () => {
    navigation.navigate("ForgotPassword");
  };
  const onSignUpPressed = () => {
    navigation.navigate("SignUp");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        backgroundColor="#f3eef6"
      >
        <View style={globalStyles.globalContainer}>
          <View style={styles.container}>
            <StatusBar style="dark" />
            <Image
              source={require("../assets/Logo.png")}
              style={[styles.img, { height: height * 0.3 }]}
              resizeMode="contain"
            />
            <Text
              style={{
                alignSelf: "flex-start",
                fontSize: 30,
                fontWeight: "bold",
                textAlign: "left",
                marginVertical: 5,
              }}
            >
              Login
            </Text>
            <Text
              style={{
                alignSelf: "flex-start",
                fontSize: 15,
                color: "grey",
                textAlign: "left",
                marginVertical: 5,
              }}
            >
              Login to continue using the app
            </Text>
            <Text style={styles.text}>Email</Text>
            <CustomInput
              name="email"
              placeholder="Enter your email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              }}
            />
            <Text style={styles.text}>Password</Text>
            <CustomInput
              name="password"
              placeholder="Enter Password"
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
            <CustomButton
              text="Forgot password?"
              onPress={onForgotPasswordPressed}
              type="RIGHT"
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
              text="Don't have an account? Register"
              onPress={onSignUpPressed}
              type="TERTIARY"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3eef6",
    padding: 20,
  },
  img: {
    width: "100%",
    height: 100,
    maxWidth: 300,
    maxHeight: 200,
  },
  text: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
});
