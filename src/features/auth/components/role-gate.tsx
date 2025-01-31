"use client";

import { UserRole } from "@prisma/client";
import { FormError } from "@/components/ui/form";
import { useCurrentRole } from "@/hooks/auth";

type RoleGateProps = {
    allowedRole: UserRole;
    children: React.ReactNode;
};

export const RoleGate = ({ allowedRole, children }: RoleGateProps) => {
    const role = useCurrentRole();

    if (role !== allowedRole) {
        return (
            <FormError message="You are not authorized to access this content" />
        );
    }

    return <>{children}</>;
};
