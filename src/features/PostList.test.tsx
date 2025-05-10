import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { BrowserRouter } from "react-router";
import type { Post } from "../types/post";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const sampleRemotePosts: Post[] = [
  {
    id: 1,
    userId: 1,
    title: "Remote Post 1 Title",
    body: "Body of remote post 1",
  },
  {
    id: 2,
    userId: 1,
    title: "Another Remote Post",
    body: "Body of remote post 2",
  },
];
const sampleLocalPosts: Post[] = [
  {
    id: 101,
    userId: 2,
    title: "Local Post Alpha",
    body: "Body of local post alpha",
  },
];

const mockToastSuccess = vi.fn();
const mockUsePosts = vi.fn();
const mockUseLocalPosts = vi.fn();
const mockUseUser = vi.fn();

vi.mock("react-hot-toast", () => ({ toast: { success: mockToastSuccess } }));
vi.mock("../api/hooks/useJsonPlaceholder", () => ({
  usePosts: () => mockUsePosts(),
  useUser: () => mockUseUser(),
}));
vi.mock("../api/hooks/useLocalPosts", () => ({
  useLocalPosts: () => mockUseLocalPosts(),
}));

describe("PostList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePosts.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseLocalPosts.mockReturnValue({
      localPosts: [],
      addLocalPost: vi.fn(),
    });
    mockUseUser.mockReturnValue({
      data: {
        id: 1,
        name: "User",
        username: "user",
        email: "user@example.com",
      },
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  describe("Data states", () => {
    test("handles different data states", async () => {
      const states = [
        {
          name: "loading",
          postsReturn: {
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
          },
          assertion: () =>
            expect(
              screen.getAllByTestId("postcard-placeholder-item").length
            ).toBeGreaterThan(0),
        },
        {
          name: "error",
          postsReturn: {
            data: undefined,
            isLoading: false,
            isError: true,
            error: new Error("Network Error"),
          },
          assertion: () => {
            expect(
              screen.getByText(/Failed to load posts\./i)
            ).toBeInTheDocument();
            expect(screen.getByText("Network Error")).toBeInTheDocument();
          },
        },
        {
          name: "empty",
          postsReturn: {
            data: [],
            isLoading: false,
            isError: false,
            error: null,
          },
          assertion: () =>
            expect(screen.getByText(/No posts available/i)).toBeInTheDocument(),
        },
      ];

      for (const state of states) {
        vi.clearAllMocks();

        mockUsePosts.mockReturnValue({
          ...state.postsReturn,
          refetch: vi.fn(),
        });

        const { PostList } = await import("./PostList");

        const { unmount } = render(<PostList />, { wrapper });

        console.log(`Testing ${state.name} state`);
        state.assertion();

        unmount();
      }
    });
  });

  describe("Rendering posts", () => {
    test("renders remote posts", async () => {
      mockUsePosts.mockReturnValue({
        data: sampleRemotePosts,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });
      const { PostList } = await import("./PostList");
      render(<PostList />, { wrapper });
      sampleRemotePosts.forEach((post) =>
        expect(screen.getByText(post.title)).toBeInTheDocument()
      );
    });

    test("renders local posts", async () => {
      mockUseLocalPosts.mockReturnValue({
        localPosts: sampleLocalPosts,
        addLocalPost: vi.fn(),
      });
      const { PostList } = await import("./PostList");
      render(<PostList />, { wrapper });
      expect(screen.getByText("Local Post Alpha")).toBeInTheDocument();
    });

    test("combines and deduplicates posts", async () => {
      const duplicate = { id: 101, userId: 3, title: "Duplicate", body: "" };
      mockUsePosts.mockReturnValue({
        data: [...sampleRemotePosts, duplicate],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });
      mockUseLocalPosts.mockReturnValue({
        localPosts: sampleLocalPosts,
        addLocalPost: vi.fn(),
      });
      const { PostList } = await import("./PostList");
      render(<PostList />, { wrapper });
      expect(screen.getByText("Local Post Alpha")).toBeInTheDocument();
      expect(screen.queryByText("Duplicate")).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    test("filters posts by search term", async () => {
      mockUsePosts.mockReturnValue({
        data: sampleRemotePosts,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });
      mockUseLocalPosts.mockReturnValue({
        localPosts: sampleLocalPosts,
        addLocalPost: vi.fn(),
      });
      const { PostList } = await import("./PostList");
      render(<PostList />, { wrapper });
      fireEvent.change(screen.getByPlaceholderText(/Search posts.../i), {
        target: { value: "Alpha" },
      });
      await waitFor(() => {
        expect(screen.getByText("Local Post Alpha")).toBeInTheDocument();
        expect(
          screen.queryByText("Remote Post 1 Title")
        ).not.toBeInTheDocument();
      });
    });

    test("opens AddPostModal and adds post", async () => {
      const mockAddLocalPostFn = vi.fn();
      mockUseLocalPosts.mockReturnValue({
        localPosts: [],
        addLocalPost: mockAddLocalPostFn,
      });

      const { PostList } = await import("./PostList");
      render(<PostList />, { wrapper });

      fireEvent.click(screen.getByTestId("open-modal-add-button"));

      fireEvent.change(screen.getByLabelText(/Title/i), {
        target: { value: "Test Title" },
      });

      fireEvent.change(screen.getByLabelText(/Description/i), {
        target: { value: "Test Body with enough characters" },
      });

      const form = screen.getByRole("dialog").querySelector("form");
      if (form) {
        expect(form).not.toBeNull();
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockAddLocalPostFn).toHaveBeenCalledTimes(1);
        expect(mockToastSuccess).toHaveBeenCalledWith(
          "Post added successfully"
        );
      });
    });
  });
});
