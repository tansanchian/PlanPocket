import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native";
import { Controller } from "react-hook-form";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import { Alert } from "react-native";

export default function ProfileScreen() {
  const [username, setUsername] = useState("");
  const [hpnumber, setHpNumber] = useState("");
  const [location, setLocation] = useState("");
  const [editable, setEditable] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [original, setOriginal] = useState({});
  const auth = getAuth();
  const user = auth.currentUser;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      hpnumber: "",
      location: "",
      username: "",
    },
  });

  const writeUserData = async (
    userId,
    hpnumber,
    location,
    imageUrl,
    username
  ) => {
    const db = getDatabase();
    const userRef = ref(db, "users/" + userId);
    try {
      await set(userRef, {
        hpnumber: hpnumber,
        location: location,
        imageUrl: imageUrl,
        username: username,
      });
      return true;
    } catch (error) {
      console.error("Error writing to database:", error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      setValue("email", user.email);
    }
    const fetchData = async (data, setData, fieldName) => {
      if (user) {
        const dbRef = ref(getDatabase());
        try {
          const snapshot = await get(child(dbRef, `users/${user.uid}/${data}`));
          if (snapshot.exists()) {
            setData(snapshot.val());
            if (fieldName) {
              setValue(fieldName, snapshot.val());
            }
          } else {
            console.log("No data available");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData("username", setUsername, "username");
    fetchData("hpnumber", setHpNumber, "hpnumber");
    fetchData("location", setLocation, "location");
    fetchData("imageUrl", setImageUrl, "imageUrl");
  }, [user, setValue]);

  useEffect(() => {
    setOriginal({
      email: watch("email"),
      username: watch("username"),
      hpnumber: watch("hpnumber"),
      location: watch("location"),
      imageUrl: watch("imageUrl"),
    });
  }, [watch]);

  useFocusEffect(
    useCallback(() => {
      setEditable(false);
    }, [])
  );
  const reauthenticate = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      setValue("email", user.email);
      console.error("Reauthentication failed:", error);
      Alert.alert(
        "Error",
        "Reauthentication failed. Please check your password and try again."
      );
      return false;
    }
  };

  const handleSave = async (data) => {
    setEditable(false);
    const newEmail = data.email;
    const writeSuccessful = await writeUserData(
      user.uid,
      hpnumber,
      location,
      imageUrl,
      watch("username")
    );
    if (!writeSuccessful) {
      Alert.alert("Error", "Failed to save user data. Please try again.");
      return;
    }
    if (newEmail !== user.email) {
      setShowPasswordModal(true);
    }
  };
  const handleCancel = () => {
    setEditable(false);
    setValue("email", original.email);
    setValue("username", username);
    setHpNumber(original.hpnumber);
    setLocation(original.location);
    setImageUrl(original.imageUrl);
  };

  const handlePasswordSubmit = async () => {
    setShowPasswordModal(false);
    const isReauthenticated = await reauthenticate();
    if (isReauthenticated) {
      try {
        await updateEmail(user, watch("email"));
        Alert.alert("Success", "Email changed successfully", [{ text: "OK" }]);
      } catch (error) {
        console.error("Error updating email:", error);
        if (error.code === "auth/too-many-requests") {
          Alert.alert(
            "Too Many Requests",
            "You have sent too many requests. Please try again later."
          );
        } else if (error.code === "auth/operation-not-allowed") {
          Alert.alert(
            "Operation Not Allowed",
            "Please enable this operation in the Firebase console."
          );
        } else {
          Alert.alert("Error", "Failed to update email");
        }
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
          <View style={styles.edit}>
            <TouchableOpacity onPress={() => setEditable(true)}>
              <Text style={{ fontSize: 18, color: "white" }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.profileImage}
          />
          <Controller
            control={control}
            name="username"
            rules={{ required: "Username is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.name, editable && styles.editableName]}
                value={value}
                editable={editable}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Username"
              />
            )}
          />
        </View>
        {errors.username && (
          <Text style={styles.errorText}>{errors.username.message}</Text>
        )}
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="grey" />
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Your Email"
                value={value}
                editable={editable}
                onChangeText={(text) => {
                  onChange(text);
                }}
                onBlur={onBlur}
                keyboardType="email-address"
              />
            )}
          />
        </View>
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="grey" />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={hpnumber}
            editable={editable}
            onChangeText={setHpNumber}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="location-on" size={20} color="grey" />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            editable={editable}
            onChangeText={setLocation}
          />
        </View>
        {editable && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSubmit(handleSave)}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        <Modal
          visible={showPasswordModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Current Password</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handlePasswordSubmit}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3eef6",
  },
  header: {
    backgroundColor: "#735DA5",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: "relative",
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  edit: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "white",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6a1b9a",
    marginTop: 10,
    textAlign: "center",
  },
  editableName: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingVertical: 5,
  },
  designation: {
    fontSize: 16,
    color: "grey",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  saveButton: {
    backgroundColor: "#D3C5E5",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  saveButtonText: {
    color: "#6a1b9a",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#E5C5C5",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  cancelButtonText: {
    color: "#6a1b9a",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: -10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#735DA5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});
