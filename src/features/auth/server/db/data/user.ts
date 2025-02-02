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

const generateUniqueUsername = async (email: string): Promise<string> => {
    const baseUsername = email.split("@")[0].toLowerCase().replaceAll(".", "");
    let username = baseUsername;
    let counter = 1;

    while (await db.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`; // Random 4-digit number
        counter++;
        if (counter > 10) {
            throw new Error("Could not generate a unique username");
        }
    }

    return username;
};
const getUserByUsername = async (username: string) => {
    try {
        const user = await db.user.findUnique({
            where: { username },
        });
        return user;
    } catch (error) {
        logError("getUserByUsername", error);
    }
};

const createUser = async (
    name: string,
    email: string,
    username: string,
    password: string,
) => {
    await db.user.create({
        data: {
            name,
            email,
            username,
            password,
        },
    });
};

export {
    getAccountByUserId,
    getUserById,
    getUserByEmail,
    updateUserPassword,
    createUser,
    generateUniqueUsername,
    getUserByUsername,
};
