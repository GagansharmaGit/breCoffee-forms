"use client";

import { useState } from "react";
import Link from "next/link";

import { useForgetPassword } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function ForgotPasswordPage() {
    const { mutateAsync: forgetPasswordAsync, isPending, isSuccess, error } = useForgetPassword();

    const [email, setEmail] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await forgetPasswordAsync({ email });
        } catch (err) {
            // Error handled by hook
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border-2 border-border p-8 rounded-xl shadow-[8px_8px_0_0_var(--color-border)]">
                <div className="space-y-2 mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Forgot Password</h1>
                    <p className="text-muted-foreground">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="jane@example.com"
                                required
                                className="border-2 border-primary bg-background shadow-sm"
                            />
                        </div>

                        {error ? <p className="text-sm text-destructive font-medium">{error.message}</p> : null}

                        <Button
                            type="submit"
                            className="w-full border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
                            disabled={isPending}
                        >
                            {isPending ? "Sending link..." : "Send reset link"}
                        </Button>
                        
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Remembered your password? <Link href="/signin" className="text-primary hover:underline font-medium">Sign in</Link>
                        </p>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="p-4 bg-primary/10 border-2 border-primary rounded-xl text-primary font-medium">
                            If an account exists for {email}, you will receive a password reset link shortly.
                        </div>
                        <Button
                            asChild
                            className="w-full border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)]"
                        >
                            <Link href="/signin">Return to sign in</Link>
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}
