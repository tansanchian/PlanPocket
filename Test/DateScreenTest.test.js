import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import DateScreenTest from "./DateScreenTest";

describe("DateScreenTest", () => {
  test("renders DateScreenTest correctly", () => {
    const { getByText, getByPlaceholderText } = render(<DateScreenTest />);

    expect(getByText("1 Day Plan")).toBeTruthy();
    expect(getByText("Title")).toBeTruthy();
    expect(getByText("Budget")).toBeTruthy();
    expect(getByText("How much you spend a meal")).toBeTruthy();
    expect(getByText("How many meals a day?")).toBeTruthy();
    expect(getByText("Date")).toBeTruthy();

    expect(getByPlaceholderText("Title")).toBeTruthy();
    expect(getByPlaceholderText("Budget")).toBeTruthy();
    expect(getByPlaceholderText("$")).toBeTruthy();
  });

  test('pressing the "Back" button logs "goBack"', () => {
    console.log = jest.fn();

    const { getByText } = render(<DateScreenTest />);

    act(() => {
      fireEvent.press(getByText("Back"));
    });

    expect(console.log).toHaveBeenCalledWith("goBack");
  });

  test("form inputs and submission", async () => {
    const { getByPlaceholderText, getByText } = render(<DateScreenTest />);

    act(() => {
      fireEvent.changeText(getByPlaceholderText("Title"), "My Event");
      fireEvent.changeText(getByPlaceholderText("Budget"), "100");
      fireEvent.changeText(getByPlaceholderText("$"), "10");

      fireEvent.press(getByText("Create"));
    });
  });

  test("shows and interacts with date picker", async () => {
    const { getByText } = render(<DateScreenTest />);

    act(() => {
      fireEvent.press(getByText("Date"));
    });

    expect(getByText("Date")).toBeTruthy();
  });

  test('toggles meals selection and "Other" input', () => {
    const { getByText, getByPlaceholderText } = render(<DateScreenTest />);

    act(() => {
      fireEvent.press(getByText("Other"));
    });

    expect(getByPlaceholderText("$")).toBeTruthy();

    act(() => {
      fireEvent.changeText(getByPlaceholderText("$"), "4");
    });

    expect(getByPlaceholderText("$").props.value).toBe("4");
  });
});
