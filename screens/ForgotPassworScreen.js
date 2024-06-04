import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useState,
  Alert,
} from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../App";

export default function FogotPassword() {
  const navigation = useNavigation();

  const onSendPressed = async () => {
    await sendPasswordResetEmail(auth, email)
      .then(() => alert("Password reset email sent!"))
      .catch((error) => {
        console.log(error.message);
        Alert.alert("Error", "User not found");
      });
  };
  const onSignInPressed = () => {
    navigation.navigate("SignIn");
  };

  const { control, handleSubmit, watch } = useForm();

  const email = watch("email");

  return (
    <ScrollView
      style={{ backgroundColor: "#f3eef6" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Reset your password</Text>
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
        <CustomButton text="Send" onPress={handleSubmit(onSendPressed)} />
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
    flex: 1,
    marginTop: 50,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f3eef6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
});
