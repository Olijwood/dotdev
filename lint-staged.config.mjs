import path from "path";

const buildEslintCommand = (filenames) => {
    const srcFiles = filenames.filter((f) => f.includes("/src/"));
    if (srcFiles.length === 0) return "echo No files to lint";

    return `next lint --fix --file ${srcFiles.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`;
};
const config = {
    "*.{js,jsx,ts,tsx}": "prettier --write",
    "*.{ts,tsx}": (filenames) => [
        filenames.some((f) => f.includes("/src/"))
            ? buildEslintCommand(filenames)
            : "yarn eslint --fix " + filenames.join(" "),
        "bash -c 'yarn check-types'",
    ],
};

export default config;
