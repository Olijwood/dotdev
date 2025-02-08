import { clsx, type ClassValue } from "clsx";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Options<T> = {
    actionFn: () => Promise<T>;
    successMessage?: string;
};

export const executeAction = async <T>({
    actionFn,
    successMessage = "The actions was successful",
}: Options<T>): Promise<{ success: boolean; message: string }> => {
    try {
        await actionFn();

        return {
            success: true,
            message: successMessage,
        };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return {
            success: false,
            message: "An error has occurred during executing the action",
        };
    }
};

export const getUsernameFromEmail = (
    email: string | null | undefined,
): string => {
    if (!email) {
        return "";
    }
    const subStr = email.substring(0, email.indexOf("@"));
    const username = subStr.replaceAll(".", "");
    return username;
};

export const getDateString = (date: Date, full = false) => {
    const now = new Date();
    const postedYear = date.getFullYear();
    const postedMonth = date.toLocaleString("default", { month: "short" });
    const postedDay = date.getDate();
    const postedDate =
        postedYear === now.getFullYear() && !full
            ? `${postedMonth} ${postedDay}`
            : `${postedMonth} ${postedDay}, ${postedYear.toString().slice(-2)}`;
    return postedDate;
};
