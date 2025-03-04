import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
        mockReset: true,
        coverage: {
            reporter: ["text", "json", "html"],
        },
        alias: {
            "@": "/src",
        },
        server: {
            deps: {
                inline: ["next"],
            },
        },
    },
});
