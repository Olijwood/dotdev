"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { sendVerificationEmail } from "../../lib/mail";
import { generateVerificationToken } from "../../lib/token";

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
        const passwordsMatch = await bcrypt.compare(
            values.password,
            dbUser.password,
        );

        if (!passwordsMatch) {
            return { error: "Invalid credentials" };
        }

        const hashedPw = await bcrypt.hash(values.newPassword, 10);
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

    return { success: "Profile updated successfully" };
};
