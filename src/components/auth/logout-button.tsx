"use client";

import { signOut } from "next-auth/react";

export type cnProp = {
    className?: string;
};

export default function LogoutButton({ className }: cnProp) {
    return (
        <button onClick={() => signOut()} className={className}>
            Logout
        </button>
    );
}
