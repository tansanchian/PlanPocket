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
  Alert,
  TextInput,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { writeProfile, readProfile } from "../../components/Database";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../App";
import { StatusBar } from "expo-status-bar";

export default function ProfileScreen() {
  const [username, setUsername] = useState("");
  const [hpnumber, setHpNumber] = useState("");
  const [location, setLocation] = useState("");
  const [editable, setEditable] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [original, setOriginal] = useState({});
  const [imageModal, setImageModal] = useState(false);

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

  const writeUserData = async (hpnumber, location, imageUrl, username) => {
    try {
      const hpnumberSuccess = await writeProfile("hpnumber", hpnumber);
      console.log(hpnumber);
      if (!hpnumberSuccess) throw new Error("Failed to update hpnumber");

      const locationSuccess = await writeProfile("location", location);
      if (!locationSuccess) throw new Error("Failed to update location");

      const imageUrlSuccess = await writeProfile("imageUrl", imageUrl);
      if (!imageUrlSuccess) throw new Error("Failed to update imageUrl");

      const usernameSuccess = await writeProfile("username", username);
      if (!usernameSuccess) throw new Error("Failed to update username");

      return true;
    } catch (error) {
      console.error("Error updating profile:", error.message);
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setValue("email", user.email);
      }
      await readProfile("username", setUsername);
      await readProfile("username", (username) =>
        setValue("username", username)
      );
      await readProfile("hpnumber", setHpNumber);
      await readProfile("hpnumber", (hpnumber) =>
        setValue("hpnumber", hpnumber)
      );
      await readProfile("location", setLocation);
      await readProfile("location", (location) =>
        setValue("location", location)
      );
      await readProfile("imageUrl", setImageUrl);
    };
    loadData();
  }, [user, setValue]);

  useEffect(() => {
    setOriginal({
      email: watch("email"),
      username: watch("username"),
      hpnumber: watch("hpnumber"),
      location: watch("location"),
      imageUrl: imageUrl,
    });
    console.log(original);
  }, [imageUrl, watch, setOriginal]);

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
      hpnumber,
      location,
      imageUrl,
      watch("username")
    );
    if (newEmail !== user.email) {
      setShowPasswordModal(true);
    } else {
      if (!writeSuccessful) {
        handleCancel();
        Alert.alert("Error", "Failed to save user data. Please try again.");
        return;
      } else {
        Alert.alert("Success", "Profile updated successfully", [
          { text: "OK" },
        ]);
      }
    }
  };

  const handleCancel = () => {
    setEditable(false);
    setValue("email", original.email);
    setValue("username", username);
    setValue("hpnumber", hpnumber);
    setValue("location", location);
    setImageUrl(original.imageUrl);
    console.log(original);
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
          Alert.alert("Operation Not Allowed", "Please inform us.");
        } else {
          Alert.alert("Error", "Failed to update email");
        }
      }
    }
  };

  const handlePasswordCancel = () => {
    setValue("email", original.email);
    setShowPasswordModal(false);
  };

  const onClose = () => {
    setImageModal(false);
  };

  const uploadImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        const source = result.assets[0].uri;
        try {
          const response = await fetch(source);
          const blob = await response.blob();
          const storageRef = ref(storage, `images/${Date.now()}.jpg`);
          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          setImageUrl(downloadURL);
          setImageModal(false);
        } catch (error) {
          console.error("Error reading file or uploading:", error);
        }
      }
    } catch (error) {
      Alert.alert("Error", "error uploading image: " + error.message);
      setImageModal(false);
    }
  };

  const removeImage = () => {
    setImageUrl("");
    writeProfile("imageUrl", "");
    setImageModal(false);
  };

  const chooseFromGallery = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const source = result.assets[0].uri;
        try {
          const response = await fetch(source);
          const blob = await response.blob();
          const storageRef = ref(storage, `images/${Date.now()}.jpg`);

          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          setImageUrl(downloadURL);
          setImageModal(false);
        } catch (error) {
          console.error("Error reading file or uploading:", error);
        }
      }
    } catch (error) {
      Alert.alert("Error", "error uploading image: " + error.message);
      console.warn(error.message);
      setImageModal(false);
    }
  };

  const ProfilePhotoModal = () => {
    return (
      <Modal visible={imageModal} transparent={true} animationType="slide">
        <View style={styles.imageModalContainer}>
          <View style={styles.imageModalContent}>
            <TouchableOpacity
              style={styles.imageCancelButton}
              onPress={onClose}
            >
              <Icon name="close" size={20} color="#735DA5" />
            </TouchableOpacity>
            <Text style={styles.imageModalTitle}>Profile Photo</Text>
            <View style={styles.imageOptionContainer}>
              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => uploadImage()}
              >
                <Icon name="camera-alt" size={30} color="#D3C5E5" />
                <Text style={styles.imageOptionText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => chooseFromGallery()}
              >
                <Icon name="photo" size={30} color="#D3C5E5" />
                <Text style={styles.imageOptionText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imageOption}
                onPress={removeImage}
              >
                <Icon name="delete" size={30} color="#D3C5E5" />
                <Text style={styles.imageOptionText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
          <View style={styles.edit}>
            <TouchableOpacity onPress={() => setEditable(true)}>
              <Text style={{ fontSize: 18, color: "white" }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.profileContainer}>
          {imageUrl == "" ? (
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
              }}
              style={styles.profileImage}
            />
          ) : (
            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          )}
          {editable && (
            <Pressable onPressIn={() => setImageModal(true)}>
              <Image
                style={styles.changeButton}
                source={{
                  uri: "https://cdn2.vectorstock.com/i/1000x1000/34/91/change-icon-simple-element-from-digital-vector-30023491.jpg",
                }}
              />
            </Pressable>
          )}
          <ProfilePhotoModal />
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
          <Controller
            control={control}
            name="hpnumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={value}
                editable={editable}
                onChangeText={(text) => {
                  onChange(text);
                }}
                onBlur={onBlur}
                keyboardType="phone-pad"
              />
            )}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="location-on" size={20} color="grey" />
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={value}
                editable={editable}
                onChangeText={(text) => {
                  onChange(text);
                }}
                onBlur={onBlur}
              />
            )}
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
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handlePasswordCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
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
  changeButton: {
    position: "absolute",
    bottom: 100,
    left: 40,
    borderRadius: 20,
    padding: 5,
    color: "blue",
    width: 30,
    height: 30,
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
  modalCancelButton: {
    backgroundColor: "#735DA5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  imageModalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  imageCancelButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  imageModalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  imageOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  imageOption: {
    alignItems: "center",
  },
  imageOptionText: {
    marginTop: 5,
    fontSize: 16,
  },
});
