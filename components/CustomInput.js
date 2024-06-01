import { Text, View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";

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