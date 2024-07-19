import { Alert } from "react-native";
import {
  createDirectlySharedScheduleDatabase,
  writeScheduleDatabase,
} from "../../../components/Database";

export default function SharedPurposeDirectly({ messageData }) {
  function formatDatez(timestamp) {
    return timestamp.split("T")[0];
  }

  const onCreateSchedulePressed = async () => {
    try {
      const result = await createDirectlySharedScheduleDatabase(
        formatDatez(messageData.events[0].fromTime),
        formatDatez(messageData.events[0].toTime)
      );

      if (result != null) {
        await writeScheduleDatabase(
          result,
          messageData.events[0].category,
          messageData.events[0].purpose,
          messageData.events[0].cost,
          messageData.events[0].description,
          messageData.events[0].fromTime,
          messageData.events[0].toTime
        );
        return result;
      } else {
        return null;
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add purpose: " + error.message);
    }
  };

  return onCreateSchedulePressed();
}
