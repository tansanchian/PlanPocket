import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";

const CustomButton = ({
  onPress,
  text,
  design = "MAIN",
  type = "PRIMARY",
  bgColor,
  fgColor,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles[`container_${design}`],
        styles[`container_${type}`],
        bgColor ? { backgroundColor: bgColor } : {},
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor ? { color: fgColor } : {},
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container_MAIN: {
    width: "100%",
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  container_HALF: {
    width: "50%",
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },

  container_PRIMARY: {
    backgroundColor: "#3B71F3",
  },

  container_TERTIARY: {},

  text_TERTIARY: {
    color: "grey",
  },
});
