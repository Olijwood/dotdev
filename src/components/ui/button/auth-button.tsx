"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button, ButtonProps } from "@/components/ui/button";

export type AuthButtonProps = ButtonProps & {
    href?: string;
    logout?: boolean;
};

const AuthButton = ({ href, logout = false, ...props }: AuthButtonProps) => {
    const handleClick = async () => {
        if (logout) await signOut();
    };

    if (href) {
        return (
            <Link href={href}>
                <Button {...props} />
            </Link>
        );
    }

    return <Button onClick={handleClick} {...props} />;
};

export { AuthButton };
