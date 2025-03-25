"use client";

import clsx from "clsx";
import { TextareaHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

type ValidatedTextareaProps = {
    name: string;
    label: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const ValidatedTextarea = ({
    name,
    label,
    className,
    maxLength,
    ...props
}: ValidatedTextareaProps) => {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();

    const value = watch(name) ?? "";
    const error = errors[name]?.message as string | undefined;

    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-900"
            >
                {label}
            </label>
            <div className="relative">
                <textarea
                    id={name}
                    {...register(name)}
                    className={clsx(
                        "block w-full rounded-md border p-2 resize-none shadow-sm focus:outline-none",
                        error
                            ? "border-red-500 ring-1 ring-red-500"
                            : "border-gray-300 focus:ring-[#3b49df] focus:ring-2",
                        className,
                    )}
                    maxLength={maxLength}
                    {...props}
                />
                {maxLength && (
                    <div className="absolute bottom-1 right-2 text-sm text-gray-400">
                        {value.length}/{maxLength}
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};
