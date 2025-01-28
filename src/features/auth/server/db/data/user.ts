import db from "@/lib/db";
import { logError } from "@/lib/logger";

const getAccountByUserId = async (userId: string) => {
    try {
        const account = await db.account.findFirst({
            where: {
                userId,
            },
        });
        return account;
    } catch (error) {
        logError("getAccountByUser", error);
    }
};

const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id },
        });
        return user;
    } catch (error) {
        logError("getUserById", error);
    }
};
const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        logError("getUserByEmail", error);
    }
};

const updateUserPassword = async (id: string, password: string) => {
    try {
        const user = await db.user.update({
            where: { id },
            data: {
                password,
            },
        });
        return user;
    } catch (error) {
        logError("updateUserPassword", error);
    }
};

export { getAccountByUserId, getUserById, getUserByEmail, updateUserPassword };
