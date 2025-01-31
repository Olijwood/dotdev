import { type User } from "next-auth";

export type StatusState = "idle" | "loading" | "error" | "success";

export type FormStatus = {
    state: StatusState;
    message?: string;
};

export type OAuthProvider = "google" | "github";

export type UserDetails = Omit<User, "id" | "email"> & {
    username: string | null | undefined;
};
