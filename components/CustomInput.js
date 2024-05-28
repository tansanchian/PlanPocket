import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";

const CustomInput = ({
  control,
  rules = {},
  name,
  placeholder,
  secureTextEntry,
  design = "",
  keyboard,
  editable = true,
  values = "",
}) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChanges = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onPressDatePicker = () => {
    setShowDatePicker(true);
  };

  if (keyboard == "time") {
    return (
      <TouchableOpacity
        style={[styles[`container${design}`]]}
        onPress={onPressDatePicker}
      >
        <View pointerEvents="none">
          <TextInput
            value={date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            onChangeText={onChanges}
          />
          {showDatePicker && (
            <DateTimePicker value={date} mode="time" onChange={onChanges} />
          )}
        </View>
      </TouchableOpacity>
    );
  } else if (keyboard == "date") {
    return (
      <TouchableOpacity
        style={[styles[`container${design}`]]}
        onPress={onPressDatePicker}
      >
        <View pointerEvents="none">
          <TextInput
            value={date.toLocaleDateString()}
            onChangeText={onChanges}
          />
          {showDatePicker && (
            <DateTimePicker value={date} mode="date" onChange={onChanges} />
          )}
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { value = values, onChange, onBlur },
          fieldState: { error },
        }) => (
          <>
            <View
              style={[
                styles[`container${design}`],
                { borderColor: error ? "red" : "#e8e8e8" },
              ]}
            >
              <TextInput
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                editable={editable}
                keyboardType={keyboard}
              />
            </View>
            {error && (
              <Text style={styles.errorText}>{error.message || "Error"}</Text>
            )}
          </>
        )}
      />
    );
  }
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",

    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 25,
  },
  containerHALF: {
    backgroundColor: "white",
    width: "50%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 25,
  },
  input: {},
  errorText: {
    color: "red",
    alignSelf: "stretch",
    textAlignVertical: "bottom",
    borderRadius: 25,
  },
});
