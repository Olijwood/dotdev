import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import authConfig from "@/config/auth.config";
import {
    deleteTwoFactorConfirmationById,
    getTwoFactorConfirmationByUserId,
    getUserById,
} from "@/data/user";

import db from "@/lib/db";
import { type ExtendedUser } from "../../next-auth";

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

            token.name = existingUser.name;
            token.email = existingUser.email;
            token.image = existingUser.image;
            token.role = existingUser.role;

            return token;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    name: token.name,
                },
            };
        },
    },
});

/**
 * Gets the user from the session.
 * @returns {Promise<ExtendedUser | undefined>}
 */
const getUser = async (): Promise<ExtendedUser | undefined> => {
    const session = await auth();
    const user = session?.user;
    return user;
};

/**
 * Gets the user ID from the session.
 * @returns {Promise<string | undefined >}
 */
const getUserId = async (): Promise<string | undefined> => {
    const session = await auth();
    const userId = session?.user?.id;
    return userId;
};

export { auth, handlers, signIn, signOut, getUser, getUserId };
