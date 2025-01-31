"use client";

import { UserInfo } from "@/features/auth/components/user-info";
import { useCurrentUser } from "@/hooks/auth";

const ClientPage = () => {
    const user = useCurrentUser();
    return <UserInfo user={user} label="Client Component" />;
};

export default ClientPage;
