import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  useWindowDimensions,
} from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { auth } from "../App";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { getDatabase } from "@firebase/database";
import { globalStyles } from "../styles/global";

export default function SignUpScreen() {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const { control, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const password = watch("password");
  const email = watch("email");
  const username = watch("username");

  const onPrivacyPolicyPressed = () => {
    console.warn("onPrivacyPolicyPressed");
  };
  const onTermsOfUsePressed = () => {
    console.warn("onTermsOfUsePressed");
  };
  const onSignInGoogle = () => {
    console.warn("onSignInGoogle");
  };
  const onSignInFacebook = () => {
    console.warn("onSignInFaceBook");
  };

  const createProfile = async (response) => {
    const db = getDatabase();
    set(ref(db, `/users/${response.user.uid}`), { username: username });
  };

  const onRegisterPressed = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (response.user) {
        await createProfile(response);
      }
      alert("Account Registered");
      navigation.navigate("SignIn");
    } catch (error) {
      if (error.code == "auth/email-already-in-use") {
        alert("Email already in use");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const onSignInPressed = () => {
    console.warn("onSignInPressed");
    navigation.navigate("SignIn");
  };

  return (
    <ScrollView
      contentContainerStyle={{ minHeight: "100%" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={globalStyles.globalContainer}>
        <Image
          source={require("../assets/Logo.png")}
          style={(styles.img, { height: height * 0.3 })}
          resizeMode="contain"
        />
        <Text style={styles.title}>Register</Text>
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 15,
            color: "grey",
            textAlign: "left",
            marginVertical: 5,
          }}
        >
          Enter Your Personal Information
        </Text>
        <Text style={styles.text}>Username</Text>
        <CustomInput
          name="username"
          placeholder="Enter your name"
          control={control}
          rules={{ required: "Username is required" }}
        />
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
          placeholder="Enter password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password should be at least 6 characters long",
            },
          }}
          secureTextEntry={true}
        />
        <Text style={styles.text}>Confirm password</Text>
        <CustomInput
          name="password-repeat"
          placeholder="Enter confirm Password"
          control={control}
          rules={{
            validate: (value) =>
              value === password ? true : "Password do not match",
          }}
          secureTextEntry={true}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <CustomButton
            text="Register"
            onPress={handleSubmit(onRegisterPressed)}
          />
        )}
        <Text style={styles.policyText}>
          By registering, you confirm that you accept our{" "}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms
          </Text>{" "}
          of Use and{" "}
          <Text style={styles.link} onPress={onPrivacyPolicyPressed}>
            Privacy Policy
          </Text>
        </Text>
        <CustomButton
          text="Sign Up with Google"
          onPress={onSignInGoogle}
          bgColor="#FAE9EA"
          fgColor="#DD4D44"
        />
        <CustomButton
          text="Sign Up with Facebook"
          onPress={onSignInFacebook}
          bgColor="#FAE9EA"
          fgColor="#DD4D44"
        />

        <CustomButton
          text="Have an account? Sign in"
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
    alignSelf: "flex-start",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 5,
  },
  policyText: { color: "#gray", marginVertical: 10 },
  link: { color: "#FDB075" },
  text: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
});
