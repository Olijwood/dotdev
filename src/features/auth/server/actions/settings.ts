"use server";

import * as z from "zod";

import { currentUser, updateSession } from "@/lib/auth";
import db from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/server/db/user";
import { hashPassword, verifyPassword } from "@/server/utils";
import { sendVerificationEmail } from "../../lib/mail";
import { generateVerificationToken } from "../../lib/token";
import { getUserByUsername } from "../db/data";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();
    if (!user || !user.id) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) return { error: "Unauthorized" };

    if (user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.username && values.username !== user.username) {
        const existingUser = await getUserByUsername(values.username);
        if (existingUser && existingUser.id !== user.id) {
            return { error: "Username already in use" };
        }
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);
        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use" };
        }

        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Verification email sent" };
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await verifyPassword(
            values.password,
            dbUser.password,
        );
        if (!passwordsMatch) {
            return { error: "Invalid credentials" };
        }

        const hashedPw = await hashPassword(values.newPassword);
        values.password = hashedPw;
    }

    delete values.newPassword;

    const filteredValues = Object.fromEntries(
        Object.entries(values).filter(
            ([_key, v]) => v !== undefined && v !== null && v !== "",
        ),
    );

    await db.user.update({
        where: { id: user.id },
        data: filteredValues,
    });

    await updateSession(user.id);

    return { success: "Profile updated successfully" };
};
