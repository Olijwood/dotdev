"use client";

import { useSession } from "next-auth/react";

const useCurrentUser = () => {
    const session = useSession();
    return session.data?.user;
};

const useCurrentUserId = () => {
    const { data: session } = useSession();
    return session?.user?.id;
};

const useCurrentRole = () => {
    const { data: session } = useSession();
    return session?.user?.role;
};

export { useCurrentUser, useCurrentRole, useCurrentUserId };
