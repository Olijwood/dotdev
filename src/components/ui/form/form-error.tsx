"use client";

import { BsExclamationCircleFill } from "react-icons/bs";

type FormSuccessProps = {
    message?: string;
};

export const FormError = ({ message }: FormSuccessProps) => {
    if (!message) {
        return null;
    }
    return (
        <div className="flex items-center space-x-4 rounded-lg bg-red-500/30 p-3 text-center text-red-500">
            <BsExclamationCircleFill className="ml-[0.2rem] size-4" />
            <p className="ml-[0.4rem] text-center text-sm font-semibold leading-normal">
                {message}
            </p>
        </div>
    );
};
