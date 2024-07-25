import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import PendingFriendItem from "../screens/MainApp/Friend/PendingFriendItem";
import { getDatabase, ref, get, child } from "firebase/database";

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  get: jest.fn(),
  child: jest.fn(),
}));

const mockItem = {
  userId: "testUserId",
  username: "Test User",
};

const mockCurrentUser = {
  uid: "currentUserId",
};

describe("PendingFriendItem", () => {
  it("renders correctly and fetches image URL", async () => {
    get.mockResolvedValueOnce({
      exists: jest.fn(() => true),
      val: jest.fn(() => "https://example.com/test-image.jpg"),
    });

    const { getByText, getByTestId } = render(
      <PendingFriendItem item={mockItem} currentUser={mockCurrentUser} />
    );

    await waitFor(() => {
      expect(getByText("Test User")).toBeTruthy();
      expect(getByTestId("image").props.source.uri).toBe(
        "https://example.com/test-image.jpg"
      );
    });
  });

  it("uses default image if no image URL is found", async () => {
    get.mockResolvedValueOnce({
      exists: jest.fn(() => false),
    });

    const { getByTestId } = render(
      <PendingFriendItem item={mockItem} currentUser={mockCurrentUser} />
    );

    await waitFor(() => {
      expect(getByTestId("image").props.source.uri).toBe(
        "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
      );
    });
  });
});
