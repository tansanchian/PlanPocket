import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import CoverScreen from "../screens/CoverScreen";
const MockedNavigator = () => (
  <NavigationContainer>
    <CoverScreen />
  </NavigationContainer>
);

describe("CoverScreen", () => {
  it("renders correctly", () => {
    const { getByText } = render(<MockedNavigator />);

    expect(getByText("Everything you need is in one place")).toBeTruthy();
    expect(
      getByText(
        "Manage both your time and finances effectively while ensuring your activties within your budget!"
      )
    ).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Register")).toBeTruthy();
  });

  it("navigates to SignIn on login button press", () => {
    const { getByText } = render(<MockedNavigator />);
    const loginButton = getByText("Login");

    fireEvent.press(loginButton);
  });

  it("navigates to SignUp on register button press", () => {
    const { getByText } = render(<MockedNavigator />);
    const registerButton = getByText("Register");

    fireEvent.press(registerButton);
  });
});
