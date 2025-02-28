import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import db from "@/lib/db";
import { LoginSchema } from "@/schemas";
import { verifyPassword } from "@/server/utils";

export default {
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const validatedData = LoginSchema.safeParse(credentials);
                if (!validatedData.success) {
                    return null;
                }
                const { email, password } = validatedData.data;
                const user = await db.user.findFirst({
                    where: {
                        email,
                    },
                });
                if (!user || !user.password || !user.email) {
                    return null;
                }

                const passwordsMatch = await verifyPassword(
                    password,
                    user.password,
                );

                if (!passwordsMatch) {
                    return null;
                }
                return user;
            },
        }),
    ],
} satisfies NextAuthConfig;
