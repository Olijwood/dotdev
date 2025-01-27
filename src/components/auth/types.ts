export type FormStatus =
    | { state: "idle" }
    | { state: "loading" }
    | { state: "error"; message: string }
    | { state: "success"; message: string };
