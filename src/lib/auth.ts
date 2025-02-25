import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import authConfig from "@/config/auth.config";
import db from "@/lib/db";
import {
    deleteTwoFactorConfirmationById,
    getAccountByUserId,
    getTwoFactorConfirmationByUserId,
    getUserById,
} from "@/server/db/user";

import { type ExtendedUser } from "../next-auth";

const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
    pages: {
        signIn: "/login",
        error: "/auth-error",
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") return true;

            if (!user.id) return false;
            const existingUser = await getUserById(user.id);
            if (!existingUser?.emailVerified) return false;

            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation =
                    await getTwoFactorConfirmationByUserId(existingUser.id);

                if (!twoFactorConfirmation) return false;

                // Delete 2FA for next signin
                await deleteTwoFactorConfirmationById(twoFactorConfirmation.id);
            }

            return true;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;

            const existingAccount = await getAccountByUserId(existingUser.id);
            token.isOAuth = !!existingAccount;

            token.name = existingUser.name;
            token.username = existingUser.username as string;
            token.email = existingUser.email as string;
            token.image = existingUser.image;
            token.role = existingUser.role;
            token.isTwoFactorEnabled =
                existingUser.isTwoFactorEnabled as boolean;

            return token;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            if (session.user) {
                session.user.isTwoFactorEnabled =
                    token.isTwoFactorEnabled as boolean;
                session.user.email = token.email as string;
                session.user.name = token.name;
                session.user.isOAuth = token.isOAuth as boolean;
                session.user.username = token.username as
                    | string
                    | null
                    | undefined;
            } else {
                console.error("session.user is undefined");
            }

            return session;
        },
    },
});

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

export {
    auth,
    handlers,
    signIn,
    signOut,
    currentUser,
    currentUserId,
    currentUserRole,
    updateSession,
};
