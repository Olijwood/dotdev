"use client";

import { CheckCheckIcon } from "lucide-react";

type FormSuccessProps = {
    message?: string;
};

export const FormSuccess = ({ message }: FormSuccessProps) => {
    if (!message) {
        return null;
    }
    return (
        <div className="flex w-full items-center justify-center space-x-2 rounded-lg bg-emerald-500/30 p-2 text-center text-emerald-500">
            <CheckCheckIcon className=" size-4" />
            <p className="text-center text-sm font-semibold leading-normal">
                {message}
            </p>
        </div>
    );
};
