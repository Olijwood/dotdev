export const PRIVATE_ROUTES = ["/dashboard"];

export const PUBLIC_ROUTES = ["/", "/new-verification"];

export type authRoute =
    | "/login"
    | "/register"
    | "/auth-error"
    | "/password-reset";

export const AUTH_ROUTES: authRoute[] = [
    "/login",
    "/register",
    "/auth-error",
    "/password-reset",
] as const;

export const DEFAULT_LOGIN_REDIRECT = "/" as const;

const LOCALHOST_URL = "http://localhost:3000" as const;
const PRODUCTION_URL = "https://www.dotdev.olijwood.co.uk" as const;
export const BASE_URL =
    process.env.NODE_ENV === "development" ? LOCALHOST_URL : PRODUCTION_URL;
