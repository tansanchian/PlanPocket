import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useForm } from "react-hook-form";
import CustomInput from "../components/CustomInput";

const MockForm = ({
  rules,
  name,
  placeholder,
  secureTextEntry,
  design,
  keyboard,
  editable,
  values,
}) => {
  const { control } = useForm();
  return (
    <CustomInput
      control={control}
      rules={rules}
      name={name}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      design={design}
      keyboard={keyboard}
      editable={editable}
      values={values}
    />
  );
};

describe("CustomInput", () => {
  it("renders correctly and matches snapshot", async () => {
    const { toJSON } = render(
      <MockForm name="test" placeholder="Enter text" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  // it("displays an error message when validation fails", () => {
  //   const { getByPlaceholderText, findByText } = render(
  //     <MockForm
  //       name="test"
  //       placeholder="Enter text"
  //       rules={{ required: "This field is required" }}
  //     />
  //   );

  //   const input = getByPlaceholderText("Enter text");
  //   fireEvent.changeText(input, "");

  //   const errorMessage = findByText("This field is required");
  //   expect(errorMessage).toBeTruthy();
  // });

  it("handles user input correctly", () => {
    const { getByPlaceholderText } = render(
      <MockForm name="test" placeholder="Enter text" />
    );

    const input = getByPlaceholderText("Enter text");
    fireEvent.changeText(input, "Test input");

    expect(input.props.value).toBe("Test input");
  });
});
