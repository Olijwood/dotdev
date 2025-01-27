import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Convert traditional extends configs into flat config-compatible objects
const compat = new FlatCompat({
    baseDirectory: __dirname, // Required for resolving paths
});
const eslintConfig = [
    {
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
            "no-unreachable": "error",
            eqeqeq: ["error", "always"],
            // curly: "error",
            "no-console": "off",
        },
    },

    // Include ESLint's built-in "recommended" rules directly

    // Convert legacy "extends" configs into flat configs
    ...compat.extends(
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:tailwindcss/recommended",
        "plugin:testing-library/react",
        "plugin:jest-dom/recommended",
        "next/core-web-vitals", // Next.js core web vitals rules
        "next/typescript", // Next.js TypeScript rules
    ),
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                browser: true,
                node: true,
                es6: true,
            },
        },
        ignores: [
            "node_modules/*",
            "public/mockServiceWorker.js",
            "generators/*",
        ],
        rules: {
            "@next/next/no-img-element": "off", // Use if you need raw <img> tags
            "react/react-in-jsx-scope": "off", // Not needed in Next.js
            "@typescript-eslint/no-unused-vars": ["error"],
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                        "object",
                    ],
                    alphabetize: { order: "asc", caseInsensitive: true },
                },
            ],
        },
    },
];

export default eslintConfig;
