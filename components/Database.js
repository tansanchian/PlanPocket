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
import { database } from "../App";
import { updateDoc, doc } from "firebase/firestore";

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

export async function writeUsernameFireStore(username) {
  const auth = getAuth();
  const user = auth.currentUser;
  await updateDoc(doc(database, "users", user.uid), {
    username: username,
  });
  return true;
}

export async function writeScheduleDatabase(
  id,
  selected,
  purpose,
  costs,
  description,
  fromTime,
  toTime
) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (userId) {
    const postSchedule = {
      category: selected || "defaultCategory",
      purpose: purpose || "defaultPurpose",
      description: description || "",
      costs: costs || "defaultCosts",
      fromTime: fromTime || "defaultFromTime",
      toTime: toTime || "defaultToTime",
    };

    try {
      const purposeRef = ref(db, `/users/${userId}/schedules/${id}/purpose/`);
      const newPurposeRef = push(purposeRef);
      await set(newPurposeRef, postSchedule);

      const scheduleSnapshot = await get(newPurposeRef);
      if (scheduleSnapshot.exists()) {
        console.log("Schedule added successfully:", scheduleSnapshot.val());
        return true;
      } else {
        console.error("Failed to add schedule");
        return false;
      }
    } catch (error) {
      console.error("Error creating Schedule:", error);
      return false;
    }
  } else {
    console.error("No authenticated user found");
    return false;
  }
}

export async function deleteScheduleDatabase(id) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (userId) {
    try {
      const schedulesRef = ref(db, `/users/${userId}/schedules`);
      const schedulesSnapShot = await get(schedulesRef);

      if (!schedulesSnapShot.exists()) {
        console.error("No data found.");
        return;
      }

      if (id !== undefined) {
        await set(ref(db, `/users/${userId}/schedules/${id}`), null);
      }
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
  toDate,
  mealBudget
) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    return "User not authenticated";
  }

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  let fromDate = parseDate(date);
  let todate = parseDate(toDate);

  const timeDiff = todate.getTime() - fromDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const mealExpenses = (daysDiff + 1) * mealBudget * meals;

  const postSchedule = {
    title: title || "Unknown title",
    budget: budget !== "" ? budget : "N/A",
    fromDate: date || "Unknown date",
    toDate: toDate || "Unknown date",
    meals: meals || "Unknown meals",
    mealBudget: mealBudget || "Unknown budget",
    mealExpenses: mealExpenses || "Unknown budget",
  };

  const budgetLeft = budget - mealExpenses;
  if (budgetLeft < 0) {
    return "404";
  }
  postSchedule["budgetLeft"] = budgetLeft;

  try {
    const schedulesRef = ref(db, `/users/${userId}/schedules`);
    const schedulesSnapshot = await get(schedulesRef);

    if (schedulesSnapshot.exists()) {
      const schedules = schedulesSnapshot.val();
      let overlap = false;

      for (let scheduleId in schedules) {
        const schedule = schedules[scheduleId];
        let scheduleFromDate = parseDate(schedule.fromDate);
        let scheduleToDate = parseDate(schedule.toDate);

        if (
          (fromDate >= scheduleFromDate && fromDate <= scheduleToDate) ||
          (todate >= scheduleFromDate && todate <= scheduleToDate) ||
          (fromDate <= scheduleFromDate && todate >= scheduleToDate)
        ) {
          overlap = true;
          break;
        }
      }

      if (overlap) {
        return "402";
      }
    }

    const newScheduleRef = push(schedulesRef);
    await set(newScheduleRef, postSchedule);
    return true;
  } catch (error) {
    console.error("Error creating Schedule:", error);
    return false;
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
        if (schedules != undefined) {
          return schedules;
        }
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error("Error readScheduleDatabase:", error);
      return null;
    }
  } else {
    console.error("User is not authenticated");
    return null;
  }
}

// export async function budgetCalculator() {
//   const auth = getAuth();
//   const db = getDatabase();
//   const userId = auth.currentUser?.uid;
//   if (userId) {
//     try {
//       const schedulesRef = ref(db, `/users/${userId}/schedules`);
//       const snapshot = await get(schedulesRef);
//     }
//   }
// }

export async function readCurrentDateDatabase() {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error("User is not authenticated");
    return null;
  }

  try {
    const schedulesRef = ref(db, `/users/${userId}/schedules`);
    const snapshot = await get(schedulesRef);

    if (!snapshot.exists()) {
      console.log("No data available");
      return null;
    }

    const schedules = snapshot.val();
    const scheduleArray = Object.values(schedules);
    const parseDate = (dateString) => {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    let minDateWithPurpose = null;
    let minEventDate = null;

    for (const schedule of scheduleArray) {
      if (schedule.purpose != undefined) {
        if (
          !minDateWithPurpose ||
          parseDate(schedule.fromDate) < parseDate(minDateWithPurpose.fromDate)
        ) {
          minDateWithPurpose = schedule;
          minEventDate = schedule.fromDate;
        }
      }
    }

    if (minDateWithPurpose) {
      const minPurposeArray = Object.values(minDateWithPurpose.purpose);
      let minPurpose = minPurposeArray[0];

      for (const purpose of minPurposeArray) {
        if (new Date(purpose.fromTime) < new Date(minPurpose.fromTime)) {
          minPurpose = purpose;
        }
      }

      console.log("Min Purpose:", minPurpose);
      console.log("Event Date:", minEventDate);

      return { purpose: minPurpose, eventDate: minEventDate };
    } else {
      console.log("No data available with purpose");
      return null;
    }
  } catch (error) {
    console.error("Error reading readCurrentDateDatabase:", error);
    return null;
  }
}

export async function readScheduleExpenses(scheduleId) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (userId) {
    try {
      const schedulesRef = ref(db, `/users/${userId}/schedules/${scheduleId}`);
      const snapshot = await get(schedulesRef);

      if (snapshot.exists()) {
        const schedules = snapshot.val();
        const data = {};
        if (schedules) {
          if (!data["dining"]) {
            data["dining"] = { costs: 0 };
          }
          if (!data["dining"]["mealBudget"]) {
            data["dining"]["mealBudget"] = { subcosts: 0 };
          }
          data["dining"]["mealBudget"]["subcosts"] = schedules.mealExpenses || 0;
          data["dining"]["costs"] = schedules.mealExpenses || 0;
          if (schedules.purpose) {
            for (let i of Object.values(schedules.purpose)) {
              const category = i.category;
              const purpose = i.purpose;
              if (!data[category]) {
                data[category] = { costs: 0 };
              }
              if (!data[category][purpose]) {
                data[category][purpose] = { subcosts: 0 };
              }
              data[category][purpose]["subcosts"] += parseInt(i.costs) || 0;
              data[category]["costs"] += parseInt(i.costs) || 0;
            }
          }
        }

        return data;
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error("Error reading readScheduleExpenses:", error);
      return null;
    }
  } else {
    console.error("User is not authenticated");
    return null;
  }
}

export async function readPurposeDatabase() {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (userId) {
    try {
      const schedulesRef = ref(db, `/users/${userId}/schedules`);
      const snapshot = await get(schedulesRef);

      if (snapshot.exists()) {
        const schedules = snapshot.val();
        if (!Array.isArray(schedules)) {
          const temp = Object.keys(schedules).map((key) => ({
            ...schedules[key],
          }));
          return temp;
        }

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

export async function checkScheduleOverlap(fromDate, toDate) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  if (!userId) {
    return "User not authenticated";
  }

  try {
    const schedulesRef = ref(db, `/users/${userId}/schedules`);
    const schedulesSnapshot = await get(schedulesRef);

    if (!schedulesSnapshot.exists()) {
      return true;
    }

    if (schedulesSnapshot.exists()) {
      const schedules = schedulesSnapshot.val();

      for (const scheduleId in schedules) {
        const schedule = schedules[scheduleId];
        const scheduleFromDate = parseDate(schedule.fromDate);
        const scheduleToDate = parseDate(schedule.toDate);

        if (
          (fromDate >= scheduleFromDate && fromDate <= scheduleToDate) ||
          (toDate >= scheduleFromDate && toDate <= scheduleToDate) ||
          (fromDate <= scheduleFromDate && toDate >= scheduleToDate)
        ) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking Schedule overlap:", error);
    return false;
  }
}

export async function createSharedScheduleDatabase(
  title,
  budget,
  meals,
  date,
  toDate,
  mealBudget
) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    return "User not authenticated";
  }

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  let fromDate = parseDate(date);
  let todate = parseDate(toDate);

  const timeDiff = todate.getTime() - fromDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const mealExpenses = (daysDiff + 1) * mealBudget * meals;

  const postSchedule = {
    title: title || "Unknown title",
    budget: budget !== "" ? budget : "N/A",
    fromDate: date || "Unknown date",
    toDate: toDate || "Unknown date",
    meals: meals || "Unknown meals",
    mealBudget: mealBudget || "Unknown budget",
    mealExpenses: mealExpenses || "Unknown budget",
  };

  const budgetLeft = budget - mealExpenses;
  if (budgetLeft < 0) {
    return "404";
  }
  postSchedule["budgetLeft"] = budgetLeft;

  try {
    const schedulesRef = ref(db, `/users/${userId}/schedules`);
    const schedulesSnapshot = await get(schedulesRef);

    if (schedulesSnapshot.exists()) {
      const schedules = schedulesSnapshot.val();
      let overlap = false;

      for (let scheduleId in schedules) {
        const schedule = schedules[scheduleId];
        let scheduleFromDate = parseDate(schedule.fromDate);
        let scheduleToDate = parseDate(schedule.toDate);

        if (
          (fromDate >= scheduleFromDate && fromDate <= scheduleToDate) ||
          (todate >= scheduleFromDate && todate <= scheduleToDate) ||
          (fromDate <= scheduleFromDate && todate >= scheduleToDate)
        ) {
          overlap = true;
          break;
        }
      }

      if (overlap) {
        return "402";
      }
    }

    const newScheduleRef = push(schedulesRef);
    await set(newScheduleRef, postSchedule);

    return newScheduleRef.key;
  } catch (error) {
    console.error("Error creating Schedule:", error);
    return false;
  }
}
