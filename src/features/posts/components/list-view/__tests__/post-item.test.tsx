import { Mock, describe, expect, it, vi } from "vitest";
import { PostItem } from "@/features/posts/components/list-view/post-item";
import { useCurrentUsername } from "@/hooks/auth";
import { generateMockPost } from "@/testing/data-generators";
import { render, screen } from "@/testing/test-utils";

vi.mock("@/hooks/auth", () => ({
    useCurrentUsername: vi.fn(),
    useCurrentUserId: vi.fn(),
}));

describe("PostItem Component", () => {
    it("renders post details correctly", () => {
        const mockPost = generateMockPost({
            title: "Test Post",
            username: "testuser",
            slug: "test-post",
            commentCount: 5,
        });

        (useCurrentUsername as Mock).mockReturnValue("anotheruser");

        render(<PostItem post={mockPost} />);

        // Title
        expect(
            screen.getByRole("heading", { name: /test post/i }),
        ).toBeInTheDocument();

        // Username
        expect(screen.getByText(/by @testuser/i)).toBeInTheDocument();

        // Comment Count
        expect(screen.getByText(/5/i)).toBeInTheDocument();
    });

    it("navigates to post detail page when title is clicked", async () => {
        const mockPost = generateMockPost({
            title: "Clickable Post",
            slug: "clickable-post",
            username: "testuser",
        });

        render(<PostItem post={mockPost} />);

        const link = screen.getByRole("link", { name: /clickable post/i });
        expect(link).toHaveAttribute("href", "/testuser/clickable-post");
    });

    it("does NOT show min read if the current user is the author", async () => {
        const mockPost = generateMockPost({
            username: "testuser",
            content: "This is a test post with some words.",
        });

        (useCurrentUsername as Mock).mockReturnValue("testuser");

        render(<PostItem post={mockPost} />);

        expect(screen.queryByText(/min read/i)).not.toBeInTheDocument();
    });
    it("shows Edit and Delete buttons if the user is the author", async () => {
        const mockPost = generateMockPost({
            username: "testuser",
            content: "This is a test post.",
        });

        (useCurrentUsername as Mock).mockReturnValue("testuser");

        render(<PostItem post={mockPost} />);

        const deleteButton = screen.getByRole("button", {
            name: /delete post/i,
        });

        const editButton = screen.getByRole("link", {
            name: /update post/i,
        });

        expect(deleteButton).toBeInTheDocument();
        expect(editButton).toHaveAttribute(
            "href",
            "/update-post/" + mockPost.slug,
        );
    });
});
