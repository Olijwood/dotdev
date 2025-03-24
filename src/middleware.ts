import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt";
import authConfig from "@/config/auth.config";
import { AUTH_ROUTES, type AuthRoute, PRIVATE_ROUTES } from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname as AuthRoute);
    const isApiRoute = nextUrl.pathname.startsWith("/api");

    const isPrivateRoute = PRIVATE_ROUTES.some((route) => {
        const pattern = new RegExp(
            "^" +
                route.replace(/:[^\/]+/g, "[^/]+").replace(/\//g, "\\/") +
                "$",
        );
        return pattern.test(nextUrl.pathname);
    });

    if (isApiRoute) return;

    if (isAuthRoute && !isLoggedIn) return;

    if (!isLoggedIn && isPrivateRoute) {
        return Response.redirect(`${req.nextUrl.origin}/login`);
    }

    const url = req.nextUrl.clone();

    if (
        token &&
        !token.hasCompletedOnboarding &&
        !url.pathname.startsWith("/onboarding")
    ) {
        url.pathname = "/onboarding";
        return Response.redirect(url);
    }

    return;
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
