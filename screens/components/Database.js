import {
  getDatabase,
  ref,
  child,
  get,
  update,
  push,
  set,
} from "firebase/database";
import { getAuth } from "firebase/auth";

export async function writeProfile(dataPath, data) {
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  const userRef = ref(db, "users/" + user.uid + "/Profile");

  try {
    const newData = {};
    newData[dataPath] = data;

    console.log("Updating database at:", `users/${user.uid}/Profile`);
    console.log("Data to update:", newData);

    await update(userRef, newData);
    console.log("Database update successful");
    return true;
  } catch (error) {
    console.error("Error writing to database:", error);
    return false;
  }
}

export const readProfile = async (data, setData) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const dbRef = ref(getDatabase());

    try {
      const snapshot = await get(
        child(dbRef, `users/${user.uid}/Profile/${data}`)
      );
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
      const userSchedulesRef = ref(db, `/users/${userId}/schedules`);
      const lastIdRef = ref(db, `/users/${userId}/lastScheduleId`);

      const lastIdSnapshot = await get(lastIdRef);
      let newId = 1;

      if (lastIdSnapshot.exists()) {
        newId = lastIdSnapshot.val() + 1;
      }
      await set(ref(db, `/users/${userId}/schedules/${newId}`), postSchedule);

      await set(lastIdRef, newId);

      return true;
    } catch (error) {
      console.error("Error creating Schedule:", error);
      return false;
    }
  }
}

export async function readScheduleDatabase(filterItem) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (userId) {
    try {
      const schedulesRef = ref(db, `/users/${userId}/schedules`);
      const snapshot = await get(schedulesRef);

      if (snapshot.exists()) {
        const schedules = snapshot.val();
        const filter = Object.values(schedules).map(
          (schedule) => schedule[filterItem]
        );
        const filterJSON = JSON.stringify(filter);
        const parseJSON = JSON.parse(filterJSON);
        console.warn(parseJSON);
        return parseJSON;
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error("Error reading Schedule:", error);
      return null;
    }
  } else {
    console.error("User is not authenticated");
    return null;
  }
}
