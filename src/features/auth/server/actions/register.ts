"use server";

import * as z from "zod";
import { hashPassword } from "@/server/utils";
import { RegisterSchema } from "../../../../schemas";
import { REGISTER_STATUS } from "../../constants";
import { sendVerificationEmail } from "../../lib/mail";
import { generateVerificationToken } from "../../lib/token";
import { createUser, generateUniqueUsername, getUserByEmail } from "../db/data";

const register = async (data: z.infer<typeof RegisterSchema>) => {
    try {
        const validatedData = RegisterSchema.parse(data);

        if (!validatedData) {
            return { error: REGISTER_STATUS.INPUR_ERR };
        }

        const { email, name, password, passwordConfirmation } = validatedData;

        if (password !== passwordConfirmation) {
            return { error: REGISTER_STATUS.PASSWORD_ERR };
        }

        const hashedPassword = await hashPassword(password);

        const userExists = await getUserByEmail(email);

        if (userExists) {
            return {
                error: REGISTER_STATUS.EMAIL_USE_ERR,
            };
        }

        const username = await generateUniqueUsername(email);
        if (!username) {
            return {
                error: "Something went wrong. Please try again later.",
            };
        }

        await createUser(name, email, username, hashedPassword);

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: REGISTER_STATUS.EMAIL_CHECK_SUCCESS };
    } catch (error) {
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

export { register };
