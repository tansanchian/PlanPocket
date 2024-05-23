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
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";

export default function SignInScreen() {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
            name="username"
            placeholder="Username"
            control={control}
            rules={{ required: "Username is required" }}
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
          <CustomButton
            text="Sign In"
            onPress={handleSubmit(onSignInPressed)}
          />
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
