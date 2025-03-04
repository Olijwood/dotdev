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
            "no-require-imports": "off",
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
        "plugin:testing-library/react",
        "next/core-web-vitals",
        "next/typescript",
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
            "@next/next/no-img-element": "off",
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-require-imports": "off",
            "testing-library/no-manual-cleanup": "error",
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
