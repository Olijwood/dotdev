export type StatusState = "idle" | "loading" | "error" | "success";

export type FormStatus = {
    state: StatusState;
    message?: string;
};

export type OAuthProvider = "google" | "github";
