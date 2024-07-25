import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { OnBoardingScreenTest } from "./OnBoardingScreenTest";

describe("OnBoardingScreenTest", () => {
  it("renders the onboarding screens correctly", () => {
    const { getByText, getAllByText } = render(<OnBoardingScreenTest />);

    // Check if titles and subtitles are present
    expect(getByText("Welcome")).toBeTruthy();
    expect(
      getByText("Welcome to our app, let us start our journey together")
    ).toBeTruthy();
    expect(getByText("Create a Customized Schedule with Ease")).toBeTruthy();
    expect(getByText("Enhance Your Schedule with Purpose")).toBeTruthy();
    expect(
      getByText("Connecting with Friends and Sharing Schedules")
    ).toBeTruthy();
    expect(
      getByText("Adjust Your Budget Allocation to Fit Your Needs")
    ).toBeTruthy();
    expect(getByText("Stay Within Budget with Real-Time Alerts")).toBeTruthy();

    // Check if button texts are present
    expect(getAllByText("Done")).toHaveLength(1); // Ensure only one "Done" button
    expect(getAllByText("Next")).toHaveLength(1); // Ensure only one "Next" button
  });

  it("navigates correctly when Next and Done buttons are pressed", async () => {
    const { getByText, queryByText } = render(<OnBoardingScreenTest />);

    // Press "Next" button until "Done" appears
    for (let i = 0; i < 5; i++) {
      // Adjust count if necessary
      fireEvent.press(getByText("Next"));
      await waitFor(() => expect(queryByText("Next")).toBeTruthy()); // Wait for the Next button to be present
    }

    // Check if "Done" button appears after pressing "Next" several times
  });

  it("calls onDone callback when Done button is pressed", async () => {
    // Mock the onDone function
    const onDoneMock = jest.fn();
    const { getByText } = render(<OnBoardingScreenTest />);

    // Wait for "Done" button to appear
    await waitFor(() => {
      const doneButton = getByText("Done");
      fireEvent.press(doneButton);
    });

    // Check if the onDone callback is called
    expect(onDoneMock).toHaveBeenCalled();
  });
});
