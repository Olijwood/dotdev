import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@/testing/test-utils";
import {
    actionCreatePost,
    actionUpdatePost,
    actionUpdatePostPublished,
} from "../../../server/actions";
import { PostForm, PostFormHandle } from "../post-form";
import { Post } from "../types";

vi.mock("next/navigation", () => ({
    useRouter: vi.fn().mockReturnValue({ push: vi.fn() }),
    redirect: vi.fn(),
}));

// Mock API actions
vi.mock("../../../server/actions", () => ({
    actionCreatePost: vi.fn(),
    actionUpdatePost: vi.fn(),
    actionUpdatePostPublished: vi.fn(),
}));

describe("PostForm Component", () => {
    const mockUserId = "test-user";

    it("renders the form with title and content inputs", () => {
        render(<PostForm userId={mockUserId} />);

        expect(
            screen.getByPlaceholderText(/your post's title/i),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/write your post content here/i),
        ).toBeInTheDocument();
    });

    it("generates a slug when title is entered", async () => {
        render(<PostForm userId={mockUserId} />);

        const titleInput = screen.getByPlaceholderText(/your post's title/i);
        fireEvent.change(titleInput, { target: { value: "My Test Post" } });
        fireEvent.blur(titleInput);

        await waitFor(() => {
            const slugInput = screen.getByTestId("post-slug");
            expect(slugInput).toHaveTextContent("my-test-post");
        });
    });

    it("validates required fields on submit", async () => {
        const mockPostTooShort = {
            id: "mockid",
            title: "T",
            content: "C",
            bannerImgUrl: "",
            published: false,
            username: "testuser",
            slug: "t",
        };
        render(<PostForm userId={mockUserId} post={mockPostTooShort} />);

        fireEvent.submit(screen.getByTestId("post-form"));

        await waitFor(() => {
            expect(screen.getByText(/title is too short/i)).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(
                screen.getByText(/content is too short/i),
            ).toBeInTheDocument();
        });
    });

    it("calls actionCreatePost when submitting new post", async () => {
        (actionCreatePost as Mock).mockResolvedValue({
            success: "Post created!",
        });

        render(<PostForm userId={mockUserId} />);

        fireEvent.change(screen.getByPlaceholderText(/your post's title/i), {
            target: { value: "New Test Post" },
        });

        fireEvent.blur(screen.getByPlaceholderText(/your post's title/i));

        fireEvent.change(
            screen.getByPlaceholderText(/write your post content here/i),
            {
                target: { value: "This is a sample post content." },
            },
        );

        fireEvent.submit(screen.getByTestId("post-form"));

        await waitFor(() => {
            expect(actionCreatePost).toHaveBeenCalledWith({
                title: "New Test Post",
                slug: "new-test-post",
                content: "This is a sample post content.",
                bannerImgUrl: "",
                published: false,
            });
        });
    });

    it("toggles preview mode", async () => {
        render(<PostForm userId={mockUserId} />);
        const titleInput = screen.getByPlaceholderText(/your post's title/i);

        fireEvent.change(titleInput, {
            target: { value: "A Test Title" },
        });

        fireEvent.blur(titleInput);

        const previewButton = screen.getAllByTestId("preview-toggle-btn")[0];
        fireEvent.click(previewButton);

        await waitFor(() => {
            expect(screen.getByTestId("post-title-preview")).toHaveTextContent(
                "A Test Title",
            );
        });

        fireEvent.click(previewButton);

        await waitFor(() => {
            expect(screen.queryByTestId("post-title-preview")).toBeNull();
        });
    });

    it("toggles published state", async () => {
        const mockPost: Post = {
            id: "post-2",
            title: "Published Post",
            slug: "published-post",
            content: "Some content",
            published: false,
            username: "testuser",
        };

        (actionUpdatePostPublished as Mock).mockResolvedValue({
            success: "Post published!",
        });

        render(<PostForm post={mockPost} userId={mockUserId} />);

        const publishButton = screen.getAllByText(/publish/i)[0];
        fireEvent.click(publishButton);

        await waitFor(() => {
            expect(actionUpdatePostPublished).toHaveBeenCalledWith(
                "post-2",
                true,
            );
        });
    });

    it("calls actionUpdatePost when manually passing postId", async () => {
        const mockPost: Post = {
            id: "post-1",
            title: "Existing Post",
            slug: "existing-post",
            content: "Old content",
            published: false,
            username: "testuser",
        };
        const formRef = { current: null } as { current: PostFormHandle | null };
        render(<PostForm ref={formRef} post={mockPost} userId="test-user" />);

        await act(async () => {
            if (formRef.current) {
                await formRef.current.onSubmit(
                    {
                        title: "Updated Title",
                        slug: "existing-post",
                        content: "Updated content",
                        bannerImgUrl: "",
                        published: false,
                    },
                    "post-1",
                );
            }
        });

        expect(actionUpdatePost).toHaveBeenCalledWith("post-1", {
            title: "Updated Title",
            slug: "existing-post",
            content: "Updated content",
            bannerImgUrl: "",
            published: false,
        });
    });
});
