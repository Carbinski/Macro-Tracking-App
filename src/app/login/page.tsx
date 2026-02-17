"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (isSignUp) {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Failed to create account");
                    setIsLoading(false);
                    return;
                }
            }

            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid username or password");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background font-mono text-sm md:text-base p-4">
            <div className="w-full max-w-md border-2 border-primary p-6 space-y-6">
                <div className="border-b-2 border-primary pb-4">
                    <h1 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-primary">
                        {">"} MACRO_TRACKER_V3.0
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {">"} STATUS: AWAITING_AUTHENTICATION
                        <br />
                        {">"} MODE:{" "}
                        {isSignUp ? "NEW_USER_REGISTRATION" : "USER_LOGIN"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground">
                            {">"} Enter_Username:
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="[ USERNAME ]"
                            className="w-full p-2 bg-transparent border border-border text-foreground font-mono uppercase tracking-wider focus:outline-none focus:border-primary"
                            required
                            minLength={3}
                            autoComplete="username"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground">
                            {">"} Enter_Password:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="[ ******** ]"
                            className="w-full p-2 bg-transparent border border-border text-foreground font-mono tracking-wider focus:outline-none focus:border-primary"
                            required
                            minLength={6}
                            autoComplete={
                                isSignUp ? "new-password" : "current-password"
                            }
                        />
                    </div>

                    {error && (
                        <div className="p-2 border border-destructive text-destructive text-xs uppercase tracking-wider">
                            {">"} ERROR: {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full p-3 border-2 border-primary bg-transparent text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">
                                [ PROCESSING... ]
                            </span>
                        ) : isSignUp ? (
                            "[ CREATE_ACCOUNT ]"
                        ) : (
                            "[ AUTHENTICATE ]"
                        )}
                    </button>
                </form>

                <div className="border-t border-border pt-4 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-widest"
                    >
                        {">"}{" "}
                        {isSignUp
                            ? "EXISTING_USER? [ LOGIN ]"
                            : "NEW_USER? [ CREATE_ACCOUNT ]"}
                    </button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                    {">"}{" "}
                    {isSignUp
                        ? "MIN: 3 CHAR USERNAME, 6 CHAR PASSWORD"
                        : "ENTER_CREDENTIALS_TO_PROCEED"}
                </div>
            </div>
        </div>
    );
}
