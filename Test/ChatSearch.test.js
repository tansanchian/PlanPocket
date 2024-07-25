import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";
import ChatSearch from "../screens/MainApp/Messenger/ChatSearch";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("ChatSearch", () => {
  it("navigates to ChatList on back icon press", () => {
    const navigateMock = jest.fn();
    useNavigation.mockReturnValue({ navigate: navigateMock });

    const { getByTestId } = render(<ChatSearch setSearch={() => {}} />);

    fireEvent.press(getByTestId("back-button"));

    expect(navigateMock).toHaveBeenCalledWith("ChatList");
  });

  it("calls setSearch with the correct input", () => {
    const setSearchMock = jest.fn();

    const { getByPlaceholderText } = render(
      <ChatSearch setSearch={setSearchMock} />
    );

    fireEvent.changeText(getByPlaceholderText("Search"), "Hello");

    expect(setSearchMock).toHaveBeenCalledWith("Hello");
  });

  it("renders the TextInput with placeholder correctly", () => {
    const { getByPlaceholderText } = render(
      <ChatSearch setSearch={() => {}} />
    );

    expect(getByPlaceholderText("Search")).toBeTruthy();
  });
});
