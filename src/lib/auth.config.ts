import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnLoginPage = nextUrl.pathname.startsWith("/login");

            if (isOnLoginPage) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/", nextUrl));
                }
                return true;
            }

            return isLoggedIn;
        },
        jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.name = user.name;
            }
            return token;
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
