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
import { parse } from "react-native-svg";

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
  costs,
  fromTime,
  toTime
) {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  const fromTimeString = fromTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const toTimeString = toTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  function convertTimeStringToDate(timeString) {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date;
  }
  if (userId) {
    const postSchedule = {
      purpose: purpose,
      description: description || "",
      costs,
      fromTimeString,
      toTimeString,
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
          const purposeRef = ref(
            db,
            `/users/${userId}/schedules/${id}/Purpose/${fromDate}`
          );
          const intervalsRef = ref(
            db,
            `/users/${userId}/schedules/${id}/Purpose/${fromDate}/intervals`
          );
          const purposeLastIdRef = ref(
            db,
            `/users/${userId}/schedules/${id}/Purpose/${fromDate}/lastPurposeId`
          );
          const purposeSnapshot = await get(purposeRef);
          const purposeLastIdSnapshot = await get(purposeLastIdRef);
          const intervalsSnapshot = await get(intervalsRef);

          let array = new Array();
          if (intervalsSnapshot.exists()) {
            array = intervalsSnapshot.val();
            for (let i = 0; i < array.length; i++) {
              const left = convertTimeStringToDate(array[i][0]);
              const right = convertTimeStringToDate(array[i][1]);
              console.log(array[i][0]);
              console.log(array[i][1]);
              console.log(
                convertTimeStringToDate("10:47 PM") < right &&
                  convertTimeStringToDate("11:47 PM") > left
              );
              if (
                convertTimeStringToDate(fromTimeString) < right &&
                convertTimeStringToDate(toTimeString) > left
              ) {
                return false;
              }
            }
          }
          array.push([fromTimeString, toTimeString]);
          if (purposeSnapshot.exists()) {
            const newId = purposeLastIdSnapshot.val() + 1;
            await set(purposeLastIdRef, newId);
            await set(
              ref(
                db,
                `/users/${userId}/schedules/${id}/Purpose/${fromDate}/${newId}`
              ),
              postSchedule
            );
          } else {
            await set(purposeLastIdRef, 0);
            await set(
              ref(db, `/users/${userId}/schedules/${id}/Purpose/${fromDate}/0`),
              postSchedule
            );
          }
          await set(intervalsRef, array);
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
  toDate,
  mealBudget
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
      mealBudget: mealBudget || "Unknown budget",
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

      // Calculate the number of days between the two dates
      const timeDiff = todate.getTime() - fromdate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      // Calculate the budget left
      const budgetLeft = budget - (daysDiff + 1) * mealBudget * meals;

      if (budgetLeft < 0) {
        return "404";
      }

      postSchedule["budgetLeft"] = budgetLeft;

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
        return "402";
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
        if (!Array.isArray(schedules)) {
          const temp = Object.keys(schedules).map((key) => ({
            ...schedules[key],
          }));
          console.log(temp);
          return temp;
        }
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
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  if (userId) {
    try {
      const schedulesRef = ref(db, `/users/${userId}/schedules`);
      const dateSetRef = ref(db, `/users/${userId}/dateSet`);
      const lastIdRef = ref(db, `/users/${userId}/lastScheduleId`);
      const snapshot = await get(schedulesRef);
      const lastIdSnapshot = await get(lastIdRef);
      const dateSetSnapshot = await get(dateSetRef);

      if (lastIdSnapshot.exists() && snapshot.exists()) {
        const schedules = snapshot.val();
        const lastId = lastIdSnapshot.val() + 1;
        const dateSet = dateSetSnapshot.val();
        const dates = Object.keys(dateSet);

        for (let i = 0; i < lastId; i++) {
          if (schedules != undefined) {
            if (schedules[i] != undefined) {
              let temp = schedules[i];
              const dateLen = dates.length;
              for (let i = 0; i < dateLen; i++) {
                const purpose = temp.Purpose[dates[i]];

                if (purpose != undefined) {
                  const lastPurposeId = purpose.lastPurposeId + 1;
                  for (let y = 0; y < lastPurposeId; y++) {
                    const fromTimeString = purpose[y].fromTimeString;
                    const toTimeString = purpose[y].toTimeString;
                    let timeParts = fromTimeString.split(":");
                    let hours = parseInt(timeParts[0], 10);
                    let minutes = parseInt(timeParts[1].split(" ")[0], 10);
                    if (fromTimeString.includes("PM") && hours !== 12) {
                      hours += 12;
                    }
                    let formattedTime =
                      hours.toString().padStart(2, "0") +
                      ":" +
                      minutes.toString().padStart(2, "0");
                    let specificDateTime = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      currentDate.getDate(),
                      parseInt(formattedTime.split(":")[0]),
                      parseInt(formattedTime.split(":")[1])
                    );

                    if (specificDateTime > currentDate) {
                      console.log(
                        "The specific time is in the future compared to current time."
                      );
                      let dateObject = new Date(formattedDate);
                      let eventDate = dateObject.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                      return (
                        eventDate +
                        " - " +
                        fromTimeString +
                        " to " +
                        toTimeString
                      );
                    }
                  }
                }
              }
            }
          }
        }
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
