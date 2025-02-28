"use server";

import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import type { ExtendedUser } from "@/next-auth";

/**
 * Gets the user from the session.
 * @returns {Promise<ExtendedUser | undefined>}
 */
const currentUser = async (): Promise<ExtendedUser | undefined> => {
    const session = await auth();
    const user = session?.user;
    return user;
};

/**
 * Gets the user ID from the session.
 * @returns {Promise<string | undefined >}
 */
const currentUserId = async (): Promise<string | undefined> => {
    const session = await auth();
    const userId = session?.user?.id;
    return userId;
};

/**
 * Retrieves the user role from the session.
 * @returns {Promise<UserRole | undefined>} A promise that resolves to the user's role, or undefined if not available.
 */
const currentUserRole = async (): Promise<UserRole | undefined> => {
    const session = await auth();
    const role = session?.user?.role;
    return role;
};

// ✅ Function to update session with latest user data
async function updateSession(userId: string) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            username: true,
            image: true,
        },
    });

    if (!user) return;

    const session = await auth();
    if (session) {
        session.user = {
            ...session.user,
            ...user,
        };
    }
}

export { currentUser, currentUserId, currentUserRole, updateSession };
