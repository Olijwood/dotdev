"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";
import { REGISTER_STATUS } from "@/constants/status-messages";
import db from "@/lib/db";
import { logError } from "@/lib/logger";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { RegisterSchema } from "@/schemas";

export const register = async (data: z.infer<typeof RegisterSchema>) => {
    try {
        // Validate the input data
        const validatedData = RegisterSchema.parse(data);

        //  If the data is invalid, return an error
        if (!validatedData) {
            return { error: REGISTER_STATUS.INPUR_ERR };
        }

        //  Destructure the validated data
        const { email, name, password, passwordConfirmation } = validatedData;

        // Check if passwords match
        if (password !== passwordConfirmation) {
            return { error: REGISTER_STATUS.PASSWORD_ERR };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check to see if user already exists
        const userExists = await db.user.findFirst({
            where: {
                email,
            },
        });

        // If the user exists, return an error
        if (userExists) {
            return {
                error: REGISTER_STATUS.EMAIL_USE_ERR,
            };
        }

        // Create the user
        await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        // Generate Verification Token
        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: REGISTER_STATUS.EMAIL_CHECK_SUCCESS };
    } catch (error) {
        // Handle the error, specifically check for a 503 error
        logError("Database error:", error);

        if ((error as { code: string }).code === "ETIMEDOUT") {
            return {
                error: "Unable to connect to the database. Please try again later.",
            };
        } else if ((error as { code: string }).code === "503") {
            return {
                error: "Service temporarily unavailable. Please try again later.",
            };
        } else {
            return {
                error: "An unexpected error occurred. Please try again later.",
            };
        }
    }
};
