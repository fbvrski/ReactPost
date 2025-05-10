import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter, Routes, Route } from "react-router";

const mockUsePost = vi.fn();
const mockUseUser = vi.fn();
const mockUseComments = vi.fn();

const samplePost = {
  id: 1,
  userId: 2,
  title: "Test Post Title",
  body: "This is the body of the test post.\nIt has multiple paragraphs.",
};

const sampleUser = {
  id: 2,
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  website: "example.com",
};

describe("PostDetailPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUsePost.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    });

    mockUseUser.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    });

    mockUseComments.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    const mockSessionStorage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify([])),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage,
      writable: true,
    });

    vi.doMock("../api/hooks/useJsonPlaceholder", () => ({
      usePost: (id: number, options?: { enabled?: boolean }) =>
        mockUsePost(id, options),
      useUser: (id: number, options?: { enabled?: boolean }) =>
        mockUseUser(id, options),
      useComments: (postId: number) => mockUseComments(postId),
    }));

    vi.doMock("./PostComments", () => ({
      PostComments: vi.fn(({ postId }) => (
        <div data-testid="post-comments">Comments for post {postId}</div>
      )),
    }));
  });

  const renderWithRouter = async (postId = "1") => {
    const { PostDetailPage } = await import("./PostDetailPage");

    return render(
      <MemoryRouter initialEntries={[`/posts/${postId}`]}>
        <Routes>
          <Route path="/posts/:postId" element={<PostDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe("Post loading states", () => {
    test("handles loading and error states for post", async () => {
      mockUsePost.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      const { PostDetailPage } = await import("./PostDetailPage");
      const { rerender } = render(
        <MemoryRouter initialEntries={["/posts/1"]}>
          <Routes>
            <Route path="/posts/:postId" element={<PostDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId("post-loading")).toBeInTheDocument();

      const errorMessage = "Post not found";
      mockUsePost.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error(errorMessage),
      });

      rerender(
        <MemoryRouter initialEntries={["/posts/1"]}>
          <Routes>
            <Route path="/posts/:postId" element={<PostDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/Error Loading Post/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(/Back to All Posts/i)).toBeInTheDocument();
    });
  });

  describe("Post content rendering", () => {
    test("displays post details when loaded from API", async () => {
      mockUsePost.mockReturnValue({
        data: samplePost,
        isLoading: false,
        isError: false,
        error: null,
      });

      mockUseUser.mockReturnValue({
        data: sampleUser,
        isLoading: false,
        isError: false,
        error: null,
      });

      await renderWithRouter();

      expect(screen.getByText(samplePost.title)).toBeInTheDocument();
      expect(screen.getByText(sampleUser.name)).toBeInTheDocument();
      expect(screen.getByText(`@${sampleUser.username}`)).toBeInTheDocument();
      expect(screen.getByText(sampleUser.email)).toBeInTheDocument();
      expect(screen.getByText(sampleUser.website)).toBeInTheDocument();

      expect(
        screen.getByText("This is the body of the test post.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("It has multiple paragraphs.")
      ).toBeInTheDocument();

      expect(screen.getByTestId("post-comments")).toBeInTheDocument();
    });

    test("loads post from sessionStorage if available", async () => {
      const localPost = { ...samplePost, title: "Local Storage Post" };
      (
        window.sessionStorage.getItem as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(JSON.stringify([localPost]));

      await renderWithRouter(localPost.id.toString());

      expect(mockUsePost).toHaveBeenCalledWith(localPost.id, {
        enabled: false,
      });
      expect(screen.getByText("Local Storage Post")).toBeInTheDocument();
    });
  });

  describe("Author information", () => {
    test("handles different author states", async () => {
      const userStates = [
        {
          name: "loading",
          userReturn: {
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
          },
          assertion: () =>
            expect(screen.getByText(/Loading author/i)).toBeInTheDocument(),
        },
        {
          name: "error",
          userReturn: {
            data: undefined,
            isLoading: false,
            isError: true,
            error: new Error("User not found"),
          },
          assertion: () => {
            const authorElement = screen.getByText(/Unknown author/i);
            expect(authorElement.textContent).toContain(
              `(ID: ${samplePost.userId})`
            );
          },
        },
        {
          name: "success",
          userReturn: {
            data: sampleUser,
            isLoading: false,
            isError: false,
            error: null,
          },
          assertion: () => {
            expect(screen.getByText(sampleUser.name)).toBeInTheDocument();
            expect(
              screen.getByText(`@${sampleUser.username}`)
            ).toBeInTheDocument();
            expect(screen.getByText(sampleUser.email)).toBeInTheDocument();
            expect(screen.getByText(sampleUser.website)).toBeInTheDocument();
          },
        },
      ];

      for (const state of userStates) {
        vi.clearAllMocks();

        mockUsePost.mockReturnValue({
          data: samplePost,
          isLoading: false,
          isError: false,
          error: null,
        });

        mockUseUser.mockReturnValue(state.userReturn);

        await renderWithRouter();

        console.log(`Testing ${state.name} state`);
        state.assertion();

        if (state !== userStates[userStates.length - 1]) {
          document.body.innerHTML = "";
        }
      }
    });
  });
});
