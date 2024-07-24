import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";
import ChatListHeader from "../screens/MainApp/Messenger/ChatListHeader";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("ChatListHeader", () => {
  const mockToggleDrawer = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigation.mockReturnValue({
      toggleDrawer: mockToggleDrawer,
      navigate: mockNavigate,
    });
  });

  it("renders correctly", () => {
    const { getByTestId } = render(<ChatListHeader />);

    expect(getByTestId("header-text")).toBeTruthy();

    expect(getByTestId("header-image")).toBeTruthy();

    expect(getByTestId("drawer-icon")).toBeTruthy();
    expect(getByTestId("search-icon")).toBeTruthy();
  });

  it("calls toggleDrawer when the drawer icon is pressed", () => {
    const { getByTestId } = render(<ChatListHeader />);

    const drawerIcon = getByTestId("drawer-icon");
    fireEvent.press(drawerIcon);

    expect(mockToggleDrawer).toHaveBeenCalled();
  });

  it('calls navigate with "SearchList" when the search icon is pressed', () => {
    const { getByTestId } = render(<ChatListHeader />);

    const searchIcon = getByTestId("search-icon");
    fireEvent.press(searchIcon);

    expect(mockNavigate).toHaveBeenCalledWith("SearchList");
  });
});
