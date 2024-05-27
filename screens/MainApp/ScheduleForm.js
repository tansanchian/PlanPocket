import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Schedule from "../../components/ScheduleUpdate";

const ScheduleForm = () => {
  const navigation = useNavigation();
  const [available, setAvailable] = useState(true);

  const { control, handleSubmit, watch } = useForm();
  const purpose = watch("Purpose");
  const budget = watch("Budget");
  const time = watch("Time");
  const others = watch("Others");

  const onAddPressed = () => {
    console.warn("onAddPressed");
    <Schedule
    // purpose={purpose}
    // budget={budget}
    // time={time}
    // others={others}
    />;
    navigation.navigate("AddSchedule");
  };
  const onBackPressed = () => {
    console.warn("onBackPressed");
    navigation.navigate("AddSchedule");
  };

  const onApplicablePressed = () => {
    console.warn("onApplicablePressed");
    setAvailable(true);
  };

  const onNotApplicablePressed = () => {
    console.warn("onNotApplicablePressed");
    setAvailable(false);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={styles.title}>Add Schedule</Text>
        <CustomInput
          name="Purpose"
          placeholder="Purpose"
          control={control}
          rules={{ required: "Purpose is required" }}
        />
        <View style={{ alignSelf: "flex-start", flexDirection: "row" }}>
          <CustomButton
            text="Budget Applicable"
            design="HALF"
            onPress={onApplicablePressed}
          />
          <CustomButton
            text="Budget Not-Applicable"
            design="HALF"
            onPress={onNotApplicablePressed}
          />
        </View>
        {available && (
          <CustomInput
            name="Budget"
            placeholder="Budget"
            control={control}
            rules={{ required: "Budget is required" }}
          />
        )}
        <CustomInput
          name="Time"
          placeholder="12.00PM"
          control={control}
          rules={{ required: "Time is required" }}
        />
        <CustomInput name="Others" placeholder="Others" control={control} />
        <CustomButton text="Add" onPress={handleSubmit(onAddPressed)} />
        <CustomButton text="Back" onPress={onBackPressed} type="TERTIARY" />
      </View>
    </ScrollView>
  );
};

export default ScheduleForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 50,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
});
