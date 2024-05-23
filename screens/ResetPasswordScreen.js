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
import { useForm } from "react-hook-form";

export default function FogotPassword() {
  const navigation = useNavigation();
  const { control, handleSubmit } = useForm();

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
        <CustomInput
          name="code"
          placeholder="Enter your code"
          control={control}
          rules={{ required: "Code is required" }}
        />
        <CustomInput
          name="newPassword"
          placeholder="Enter your new password"
          control={control}
          rules={{ required: "Password is required" }}
        />
        <CustomButton text="Submit" onPress={handleSubmit(onSubmitPressed)} />
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
