import { StyleSheet, Alert } from "react-native";
import { getDatabase, ref, child, get, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";

export default async function writeProfile(dataPath, data) {
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  const userRef = ref(db, "users/" + user.user.uid);
  try {
    const newData = {
      "Profile/dataPath": data,
    };
    await update(userRef, newData);
    return true;
  } catch (error) {
    console.error("Error writing to database:", error);
    return false;
  }
}

export const readProfile = async (data, setData, fieldName) => {
  const auth = getAuth();
  const user = auth.currentUser;
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

export async function writeScheduleDatabase(
  purpose,
  budget,
  time,
  date,
  toTime,
  toDate,
  others
) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (userId) {
    const postSchedule = {
      purpose: purpose || "Unknown purpose",
      budget: budget !== "" ? budget : "N/A",
      FromTime: time || "Unknown time",
      FromDate: date || "Unknown date",
      ToTime: toTime || "Unknown time",
      ToDate: toDate || "Unknown date",
      others: others || "N/A",
    };

    try {
      const newPostKey = push(child(ref(db), "schedules")).key;
      await set(
        ref(db, `/users/${userId}/schedules/${newPostKey}`),
        postSchedule
      );
      return true;
    } catch (error) {
      console.error("Error creating Schedule:", error);
      return false;
    }
  }
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    backgroundColor: "pink",
    padding: 20,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
});
