import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";

// Mock Next.js useRouter properly
vi.mock("next/router", () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
        prefetch: vi.fn(),
        replace: vi.fn(),
        pathname: "/",
        query: {},
        asPath: "/",
    })),
}));

vi.mock("next/navigation", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next/navigation")>();
    const { useRouter } =
        await vi.importActual<typeof import("next-router-mock")>(
            "next-router-mock",
        );
    const usePathname = vi.fn().mockImplementation(() => {
        const router = useRouter();
        return router.pathname;
    });
    const useSearchParams = vi.fn().mockImplementation(() => {
        const router = useRouter();
        return new URLSearchParams(router.query?.toString());
    });
    return {
        ...actual,
        useRouter: vi.fn().mockImplementation(useRouter),
        usePathname,
        useSearchParams,
    };
});

// Mock NextAuth session (if used)
vi.mock("next-auth/react", () => ({
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
    useSession: vi.fn(() => ({ data: null, status: "unauthenticated" })),
}));

expect.extend(matchers);
