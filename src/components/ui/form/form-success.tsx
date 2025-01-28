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
        <div className="flex items-center space-x-4 rounded-lg bg-emerald-500/30 p-2 text-emerald-500">
            <CheckCheckIcon className="ml-[0.2rem] size-4" />
            <p className="ml-[0.4rem] text-center text-sm font-semibold leading-normal">
                {message}
            </p>
        </div>
    );
};
