import NextAuth from "next-auth";
import authConfig from "@/config/auth.config";
import { AUTH_ROUTES, type authRoute, PUBLIC_ROUTES } from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname as authRoute);
    const isApiRoute = nextUrl.pathname.startsWith("/api");
    // const isPrivateRoute = PRIVATE_ROUTES.includes(nextUrl.pathname);
    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

    if (isApiRoute) return;

    if (isAuthRoute && isLoggedIn) {
        return Response.redirect(`${req.nextUrl.origin}/`);
    }
    if (isAuthRoute && !isLoggedIn) return;

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(`${req.nextUrl.origin}/login`);
    }

    return;
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
