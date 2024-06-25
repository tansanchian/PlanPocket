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
  description,
  fromDate,
  costs
) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (userId) {
    const postSchedule = {
      purpose: purpose,
      description: description || "",
      costs,
    };

    try {
      const lastIdRef = ref(db, `/users/${userId}/lastScheduleId`);
      const dateRef = ref(db, `/users/${userId}/dateSet`);
      const lastIdSnapshot = await get(lastIdRef);
      const dateSetSnapshot = await get(dateRef);

      if (lastIdSnapshot.exists() && dateSetSnapshot.exists()) {
        const dateSetObject = dateSetSnapshot.val();
        const dateSet = new Map(Object.entries(dateSetObject));
        if (dateSet.has(fromDate)) {
          const id = dateSet.get(fromDate);
          await update(
            ref(db, `/users/${userId}/schedules/${id}/${fromDate}`),
            postSchedule
          );
          return true;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error creating Schedule:", error);
      return false;
    }
  }
}

export async function deleteScheduleDatabase(fromDate, toDate) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (userId) {
    try {
      const lastIdRef = ref(db, `/users/${userId}/lastScheduleId`);
      const dateSetRef = ref(db, `/users/${userId}/dateSet`);
      const schedulesRef = ref(db, `/users/${userId}/schedules`);

      const parseDate = (dateString) => {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day + 1);
      };

      const timeToString = (time) => {
        return time.toISOString().split("T")[0];
      };

      const schedulesSnapShot = await get(schedulesRef);
      const lastIdSnapshot = await get(lastIdRef);
      const dateSetSnapshot = await get(dateSetRef);

      if (!dateSetSnapshot.exists() || !schedulesSnapShot.exists()) {
        console.error("No data found.");
        return;
      }

      const dateSetObject = dateSetSnapshot.val();
      const newSet = new Map(Object.entries(dateSetObject));
      let id = newSet.get(fromDate);

      if (lastIdSnapshot.exists() && lastIdSnapshot.val() === id) {
        if (id == 0) {
          await set(lastIdRef, null);
        } else {
          await set(lastIdRef, id - 1);
        }
      }

      if (id !== undefined) {
        await set(ref(db, `/users/${userId}/schedules/${id}`), null);
      }

      let currentDate = parseDate(fromDate);
      const endDate = parseDate(toDate);

      while (currentDate <= endDate) {
        const currentDateString = timeToString(currentDate);
        console.log(currentDateString);
        newSet.delete(currentDateString);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      await set(dateSetRef, Object.fromEntries(newSet.entries()));
    } catch (error) {
      console.error("Error deleting Schedule:", error);
    }
  }
}

export async function createScheduleDatabase(
  title,
  budget,
  meals,
  date,
  toDate
) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (userId) {
    const postSchedule = {
      title: title || "Unknown title",
      budget: budget !== "" ? budget : "N/A",
      fromDate: date || "Unknown date",
      toDate: toDate || "Unknown date",
      meals: meals || "Unknown meals",
    };

    try {
      const lastIdRef = ref(db, `/users/${userId}/lastScheduleId`);
      const dateSet = ref(db, `/users/${userId}/dateSet`);
      const lastIdSnapshot = await get(lastIdRef);
      const dateSetSnapshot = await get(dateSet);
      const parseDate = (dateString) => {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day + 1);
      };
      const timeToString = (time) => {
        const date = new Date(time);
        return date.toISOString().split("T")[0];
      };
      let fail = false;

      let newId = 0;
      let newSet = new Map();
      let todate = parseDate(toDate);
      let fromdate = parseDate(date);

      if (lastIdSnapshot.exists()) {
        newId = lastIdSnapshot.val() + 1;
      }

      if (dateSetSnapshot.exists()) {
        const dateSetObject = dateSetSnapshot.val();
        newSet = new Map(Object.entries(dateSetObject));
      }

      while (fromdate <= todate) {
        const stringFromDate = timeToString(fromdate);
        if (newSet.has(stringFromDate)) {
          fail = true;
          break;
        }
        newSet.set(stringFromDate, newId);
        fromdate.setDate(fromdate.getDate() + 1);
      }

      if (!fail) {
        await set(ref(db, `/users/${userId}/schedules/${newId}`), postSchedule);

        await set(dateSet, Object.fromEntries(newSet.entries()));

        await set(lastIdRef, newId);

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error creating Schedule:", error);
      return false;
    }
  }
}

export async function readScheduleDatabase() {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (userId) {
    try {
      const schedulesRef = ref(db, `/users/${userId}/schedules`);
      const snapshot = await get(schedulesRef);

      if (snapshot.exists()) {
        const schedules = snapshot.val();
        console.log(schedules);
        return schedules;
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
