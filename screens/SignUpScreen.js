import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useNavigation } from "@react-navigation/native";

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const navigation = useNavigation();

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
  const onRegisterPressed = () => {
    console.warn("onRegisterPressed");
    navigation.navigate("SignIn");
  };
  const onSignInPressed = () => {
    console.warn("onSignInPressed");
    navigation.navigate("SignIn");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>
        <CustomInput
          placeholder="Username"
          value={username}
          setValue={setUsername}
          secureTextEntry={false}
        />
        <CustomInput
          placeholder="Email"
          value={email}
          setValue={setEmail}
          secureTextEntry={false}
        />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
        />
        <CustomInput
          placeholder="Repeat Password"
          value={passwordRepeat}
          setValue={setPasswordRepeat}
          secureTextEntry={true}
        />
        <CustomButton text="Register" onPress={onRegisterPressed} />
        <Text style={styles.text}>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
  text: { color: "#gray", marginVertical: 10 },
  link: { color: "#FDB075" },
});
