import { UserRole } from "@prisma/client";
import { type DefaultSession, type DefaultUser } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    username: string | null | undefined;
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    hasCompletedOnboarding: boolean;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
    interface User extends DefaultUser {
        id: string;
        username?: string | null;
    }
}
