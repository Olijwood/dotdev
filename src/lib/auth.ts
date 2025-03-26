import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import authConfig from "@/config/auth.config";
import { generateUniqueUsername } from "@/features/auth/server/db/data";
import db from "@/lib/db";
import {
    deleteTwoFactorConfirmationById,
    getAccountByUserId,
    getTwoFactorConfirmationByUserId,
    getUserById,
} from "@/server/db/user";

const { auth, handlers, signIn, signOut } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
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

            if (!user.username && user.email) {
                const uniqueUsername = await generateUniqueUsername(user.email);
                await db.user.update({
                    where: { id: user.id },
                    data: { username: uniqueUsername },
                });
            }
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            if (!user.id) return false;
            if (account?.provider !== "credentials") {
                const existingUser = await getUserById(user.id);
                if (existingUser && !existingUser.username) {
                    const uniqueUsername = await generateUniqueUsername(
                        existingUser.email,
                    );
                    await db.user.update({
                        where: { id: existingUser.id },
                        data: { username: uniqueUsername },
                    });
                }
                return true;
            }

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
            token.hasCompletedOnboarding =
                existingUser.hasCompletedOnboarding as boolean;

            token.name = existingUser.name;
            token.username = existingUser.username as string;
            token.email = existingUser.email as string;
            token.image = existingUser.image as string;
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
                session.user.image = token.image as string;
                session.user.hasCompletedOnboarding =
                    token.hasCompletedOnboarding as boolean;
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

export { auth, handlers, signIn, signOut };
