import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("Header Component", () => {
  const mockToggleDrawer = jest.fn();

  beforeEach(() => {
    useNavigation.mockReturnValue({
      toggleDrawer: mockToggleDrawer,
    });
  });

  it("should render with the correct title", () => {
    const { getByText } = render(<Header title="Test Title" />);
    expect(getByText("Test Title")).toBeTruthy();
  });

  it("should call toggleDrawer when the icon is pressed", () => {
    const { getByTestId } = render(<Header title="Test Title" />);
    fireEvent.press(getByTestId("drawer-toggle"));
    expect(mockToggleDrawer).toHaveBeenCalled();
  });

  it("should match the snapshot", () => {
    const { toJSON } = render(<Header title="Test Title" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
