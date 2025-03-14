import NextAuth from "next-auth";
import authConfig from "@/config/auth.config";
import {
    AUTH_ROUTES,
    type AuthRoute,
    type PrivateRoute,
    PRIVATE_ROUTES,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname as AuthRoute);
    const isApiRoute = nextUrl.pathname.startsWith("/api");
    const isPrivateRoute = PRIVATE_ROUTES.includes(
        nextUrl.pathname as PrivateRoute,
    );

    if (isApiRoute) return;

    if (isAuthRoute && !isLoggedIn) return;

    if (!isLoggedIn && isPrivateRoute) {
        return Response.redirect(`${req.nextUrl.origin}/login`);
    }

    return;
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
