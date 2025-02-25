import type { JSX } from "react";

export type markdownSyntaxItem = {
    prefix: string;
    suffix: string;
    type: "wrap" | "prefix" | "block" | "link";
    icon: JSX.Element;
    tooltip: string;
};
