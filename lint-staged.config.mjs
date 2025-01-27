import path from "path";

const buildEslintCommand = (filenames) => {
    return `next lint --fix --file ${filenames
        .filter((f) => f.includes("/src/"))
        .map((f) => path.relative(process.cwd(), f))
        .join(" --file ")}`;
};

const config = {
    "*.{js,jsx,ts,tsx}": "prettier --write",
    "*.{ts,tsx}": [buildEslintCommand, "bash -c 'yarn check-types'"],
};

export default config;
