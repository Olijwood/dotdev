"use client";

import { FocusEventHandler } from "react";
import { Input } from "@/components/ui/input";

type PostTitleInputProps = {
    value?: string | undefined;
    onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
    validSlugMsg: string | null | undefined;
};

export const PostTitleInput = ({
    value,
    onBlur,
    onChange,
    validSlugMsg,
    ...props
}: PostTitleInputProps) => {
    return (
        <>
            <Input
                value={value}
                placeholder="Your post's title"
                className="border-0 px-0 text-3xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0 sm:h-12 md:!text-4xl "
                onBlur={onBlur}
                onChange={onChange}
                required
                {...props}
            />
            {validSlugMsg && (
                <p className="mt-1 text-sm text-red-500">{validSlugMsg}</p>
            )}
        </>
    );
};
