import React from "react";
import { render } from "@testing-library/react-native";
import AboutUsScreenTest from "./AboutUsScreenTest";

describe("AboutUsScreenTest", () => {
  it("renders correctly", () => {
    const { getByTestId, getByText } = render(<AboutUsScreenTest />);

    const logo = getByTestId("logo");
    expect(logo).toBeTruthy();

    const title = getByText("About Us");
    expect(title).toBeTruthy();
    const paragraph = getByText(
      "Welcome to our application. We are BingBong from NUS! Thank you for spending your time on our app."
    );
    expect(paragraph).toBeTruthy();
  });
});
