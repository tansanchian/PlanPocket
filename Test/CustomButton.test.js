import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomButton from "../components/CustomButton";

describe("CustomButton", () => {
  it("renders correctly and matches snapshot", () => {
    const { toJSON } = render(<CustomButton text="Test" onPress={() => {}} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("calls onPress function when the button is pressed", () => {
    const mockOnPress = jest.fn();

    const { getByTestId } = render(
      <CustomButton text="Test" onPress={mockOnPress} />
    );

    const pressMeButton = getByTestId("MyButton:Button:ClickMe");
    fireEvent.press(pressMeButton);

    expect(mockOnPress).toHaveBeenCalled();
  });
});
