"use client";

import { BsExclamationTriangleFill } from "react-icons/bs";

type FormWarningProps = {
    message?: string;
};

export const FormWarning = ({ message }: FormWarningProps) => {
    if (!message) {
        return null;
    }
    return (
        <div className="flex w-full items-center justify-center space-x-2 rounded-lg bg-amber-500/40 p-3 text-center text-amber-600">
            <BsExclamationTriangleFill className="size-4" />
            <p className=" text-center text-sm font-semibold leading-normal">
                {message}
            </p>
        </div>
    );
};
