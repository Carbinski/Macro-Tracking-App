import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import User from "@/models/User";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.username || !credentials?.password)
                        return null;

                    await dbConnect();
                    const user = await User.findOne({
                        username: (
                            credentials.username as string
                        )
                            .toLowerCase()
                            .trim(),
                    });
                    if (!user) return null;

                    const isValid = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );
                    if (!isValid) return null;

                    return {
                        id: user._id.toString(),
                        name: user.username,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    trustHost: true,
});
