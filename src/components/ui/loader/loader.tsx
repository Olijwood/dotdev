"use client";

import { BeatLoader } from "react-spinners";

const sizes = {
    md: 15,
    lg: 20,
    xl: 30,
};

export type LoaderProps = {
    size?: keyof typeof sizes;
};

export const Loader = ({ size }: LoaderProps) => {
    return <BeatLoader size={sizes[size || "md"]} />;
};
//
