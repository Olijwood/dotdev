import { describe, it, expect, vi, Mock } from "vitest";
import { PostFeed } from "@/features/posts/components/list-view/post-feed/post-feed";
import { getPosts } from "@/features/posts/server/db";
import { generateMockPosts } from "@/testing/data-generators";
import { render, screen, waitFor } from "@/testing/test-utils";

vi.mock("@/features/posts/server/db", () => ({
    getPosts: vi.fn(),
}));

describe("PostFeed Component", () => {
    it("fetches and displays posts", async () => {
        const mockPosts = generateMockPosts(3);

        (getPosts as Mock).mockResolvedValue(mockPosts);

        render(await PostFeed());

        await waitFor(() => {
            mockPosts.forEach((post) => {
                expect(
                    screen.getByRole("heading", { name: post.title }),
                ).toBeInTheDocument();
            });
        });
    });

    it("renders empty state if no posts", async () => {
        (getPosts as Mock).mockResolvedValue([]);

        render(await PostFeed());

        await waitFor(() => {
            expect(screen.getByText(/no posts available/i)).toBeInTheDocument();
        });
    });
});
