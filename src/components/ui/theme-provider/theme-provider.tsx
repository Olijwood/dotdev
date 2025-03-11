"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import type { ThemeProviderProps } from "next-themes";
import {
    ThemeProvider as NextThemesProvider,
    useTheme as useNextTheme,
} from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    const [mounted, setMounted] = useState(false);

    // Ensure theme is only applied after mounting to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ThemeToggle() {
    const { theme, setTheme } = useNextTheme();
    const [mounted, setMounted] = useState(false);

    // Wait for component to mount to access theme
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <SunIcon className="size-5" />
            ) : (
                <MoonIcon className="size-5" />
            )}
        </button>
    );
}

// Export useTheme from next-themes directly
export { useTheme } from "next-themes";
