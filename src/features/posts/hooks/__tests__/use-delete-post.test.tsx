import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mock, vi, test, expect } from "vitest";
import { useDeletePost } from "@/features/posts/hooks";
import { deletePostById } from "@/features/posts/server/db";
import { renderHook, act } from "@/testing/test-utils";

// Mock dependencies
vi.mock("@/features/posts/server/db", () => ({
    deletePostById: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
}));

test("should open and close modal", () => {
    const { result } = renderHook(() => useDeletePost("post-id"));

    // Initially, modal is closed
    expect(result.current.modal.props.isOpen).toBe(false);

    act(() => result.current.openModal());
    expect(result.current.modal.props.isOpen).toBe(true);

    act(() => result.current.modal.props.onClose());
    expect(result.current.modal.props.isOpen).toBe(false);
});

test("should delete post and navigate on success", async () => {
    (deletePostById as Mock).mockResolvedValue(true);
    const pushMock = vi.fn();
    (useRouter as Mock).mockReturnValue({ push: pushMock });

    const { result } = renderHook(() => useDeletePost("post-id"));

    await act(async () => {
        await result.current.modal.props.onConfirm();
    });

    expect(deletePostById).toHaveBeenCalledWith("post-id");
    expect(toast.success).toHaveBeenCalledWith("Post deleted successfully!");
    expect(pushMock).toHaveBeenCalledWith("/");
});

test("should show error if deletion fails", async () => {
    (deletePostById as Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useDeletePost("post-id"));

    await act(async () => {
        await result.current.modal.props.onConfirm();
    });

    expect(deletePostById).toHaveBeenCalledWith("post-id");
    expect(toast.error).toHaveBeenCalledWith(
        "Failed to delete post. Please try again.",
    );
});
