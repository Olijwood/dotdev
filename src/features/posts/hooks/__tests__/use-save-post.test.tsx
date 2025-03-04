import { vi, Mock, test, expect } from "vitest";
import { useSavePost } from "@/features/posts/hooks/use-save-post";
import { toggleSavePostAction } from "@/features/posts/server/actions";
import { isPostSaved } from "@/features/posts/server/db";
import { renderHook, act, waitFor } from "@/testing/test-utils";

vi.mock("@/features/posts/server/actions", () => ({
    toggleSavePostAction: vi.fn(),
}));

vi.mock("@/features/posts/server/db", () => ({
    isPostSaved: vi.fn(),
}));

test("should check if a post is saved on mount", async () => {
    (isPostSaved as Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useSavePost("test-post-id"));

    await act(async () => {
        await result.current.checkSavedStatus();
    });

    await waitFor(() => expect(result.current.isSaved).toBe(true));
});

test("should toggle post save status", async () => {
    (toggleSavePostAction as unknown as Mock).mockResolvedValue({
        saved: true,
    });

    const { result } = renderHook(() => useSavePost("test-post-id"));

    await act(async () => {
        await result.current.toggleSave();
    });

    expect(toggleSavePostAction).toHaveBeenCalledWith("test-post-id");
    expect(result.current.isSaved).toBe(true);
});
