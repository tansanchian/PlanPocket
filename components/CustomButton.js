import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  TouchableOpacity,
} from "react-native";
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
    <TouchableOpacity
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
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container_MAIN: {
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  container_HALF: {
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: "50%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  container_RIGHT: {
    alignItems: "flex-end",
  },
  text_RIGHT: {
    color: "grey",
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },

  container_PRIMARY: {
    backgroundColor: "#735DA5",
  },

  container_TERTIARY: {},

  text_TERTIARY: {
    color: "grey",
  },
});
