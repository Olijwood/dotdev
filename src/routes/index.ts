export const PRIVATE_ROUTES = [
    "/dashboard",
    "/settings",
    "/create-post/:path",
    "/update-post/:path",
    "/following/:path",
    "/following",
] as const;

export type AuthRoute =
    | "/login"
    | "/register"
    | "/auth-error"
    | "/password-reset"
    | "/new-password";
export const AUTH_ROUTES = [
    "/login",
    "/register",
    "/auth-error",
    "/password-reset",
    "/new-password",
] as const;

export const DEFAULT_LOGIN_REDIRECT = "/" as const;

const LOCALHOST_URL = "http://localhost:3000" as const;
const PRODUCTION_URL = "https://www.dotdev.olijwood.co.uk" as const;
export const BASE_URL =
    process.env.NODE_ENV === "development" ? LOCALHOST_URL : PRODUCTION_URL;
