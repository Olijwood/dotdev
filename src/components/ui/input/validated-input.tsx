// components/ui/validated-input.tsx
"use client";

import clsx from "clsx";
import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

type ValidatedInputProps = {
    name: string;
    label: string;
    externalError?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const ValidatedInput = ({
    name,
    label,
    externalError,
    className,
    ...props
}: ValidatedInputProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const error = (errors[name]?.message as string) || externalError;

    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-900"
            >
                {label}
            </label>
            <input
                id={name}
                {...register(name)}
                className={clsx(
                    "block w-full rounded-md border p-2 shadow-sm focus:outline-none",
                    error
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300 focus:ring-[#3b49df] focus:ring-2",
                    className,
                )}
                role="button"
                {...props}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};
