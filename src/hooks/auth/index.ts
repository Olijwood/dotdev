import { useSession } from "next-auth/react";

const useCurrentUser = () => {
    const { data: session } = useSession();
    return session?.user;
};

const useCurrentRole = () => {
    const { data: session } = useSession();
    return session?.user?.role;
};

export { useCurrentUser, useCurrentRole };
