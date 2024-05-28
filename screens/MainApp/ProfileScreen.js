import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getDatabase, ref, child, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";

export default function ProfileScreen() {
  const [username, setUsername] = useState("");
  const [hpnumber, setHpNumber] = useState("");
  const [location, setLocation] = useState("");
  const [editable, setEditable] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async (data, setData) => {
      if (user) {
        const dbRef = ref(getDatabase());
        try {
          const snapshot = await get(child(dbRef, `users/${user.uid}/${data}`));
          if (snapshot.exists()) {
            setData(snapshot.val());
          } else {
            console.log("No data available");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData("username", setUsername);
    fetchData("hpnumber", setHpNumber);
    fetchData("location", setLocation);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setEditable(false);
    }, [])
  );

  const handleSave = () => {
    setEditable(false);
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
          <Text style={styles.name}>{username}</Text>
        </View>
        <Text>Email</Text>
        <CustomInput
          name="email"
          placeholder="Enter your email"
          control={control}
          rules={{
            required: false,
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          }}
          editable={editable}
        />
        <Text>Phone Number</Text>
        <CustomInput
          name="phone"
          placeholder="Enter your PhoneNumber"
          control={control}
          editable={editable}
          keyboard={"numeric"}
        />
        <Text>Location</Text>
        <CustomInput
          name="location"
          placeholder="Enter your location"
          control={control}
          editable={editable}
          icon="location-on"
        />
        {editable && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit(handleSave)}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
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
    width: 150,
    height: 150,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "white",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6a1b9a",
    marginTop: 10,
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
    marginHorizontal: 20,
    marginVertical: 10,
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
});
