"use server";

import { UserRole } from "@prisma/client";
import { currentUserRole } from "@/lib/auth";

export const admin = async () => {
    const role = await currentUserRole();
    if (role === UserRole.USER) {
        return { error: "Forbidden Server Action!" };
    }
    return { success: "Allowed Server Action!" };
};
