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
        <div className="flex w-full items-center justify-center space-x-2 rounded-lg bg-red-500/30 p-3 text-center text-red-500">
            <BsExclamationCircleFill className=" size-4" />
            <p className=" text-center text-sm font-semibold leading-normal">
                {message}
            </p>
        </div>
    );
};
