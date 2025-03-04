import { Mock, vi, test, expect } from "vitest";
import { useValidateSlug } from "@/features/posts/hooks/use-validate-slug";
import { postBySlugExists } from "@/features/posts/server/db";
import { renderHook, waitFor } from "@/testing/test-utils";

vi.mock("@/features/posts/server/db", () => ({
    postBySlugExists: vi.fn(),
}));

test("should validate an available slug", async () => {
    (postBySlugExists as Mock).mockResolvedValue(false);

    const { result, rerender } = renderHook(
        ({ slug }) => useValidateSlug(slug),
        {
            initialProps: { slug: "valid-slug" },
        },
    );

    await waitFor(() => expect(result.current.isValid).toBe(true));
    expect(result.current.validSlugMsg).toBe("");

    // Re-render with a different slug
    rerender({ slug: "new-valid-slug" });
    await waitFor(() => expect(result.current.isValid).toBe(true));
});

test("should detect an existing slug", async () => {
    (postBySlugExists as Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useValidateSlug("existing-slug"));

    await waitFor(() => expect(result.current.isValid).toBe(false));

    await waitFor(() =>
        expect(result.current.validSlugMsg).toBe(
            "This title is already in use!",
        ),
    );
});

test("should skip validation for an empty or too short slug", async () => {
    const { result } = renderHook(() => useValidateSlug("ab"));

    await waitFor(() => expect(result.current.isValid).toBe(false));
    expect(result.current.validSlugMsg).toBe("");
});
