import { View, Text, StyleSheet, ScrollView } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { control, handleSubmit, watch } = useForm();
  const pwd = watch("password");

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
          name="username"
          placeholder="Username"
          control={control}
          rules={{ required: "Username is required" }}
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
              value: 8,
              message: "Password should be at least 8 characters long",
            },
          }}
          secureTextEntry={true}
        />
        <CustomInput
          name="password-repeat"
          placeholder="Repeat Password"
          control={control}
          rules={{
            validate: (value) =>
              value === pwd ? true : "Password do not match",
          }}
          secureTextEntry={true}
        />
        <CustomButton
          text="Register"
          onPress={handleSubmit(onRegisterPressed)}
        />
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
