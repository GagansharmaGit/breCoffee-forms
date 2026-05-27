"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

import { useResetPassword } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const { mutateAsync: resetPasswordAsync, isPending, error } = useResetPassword();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLocalError("");
        
        if (!token) {
            setLocalError("Invalid or missing reset token.");
            return;
        }

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match.");
            return;
        }

        try {
            await resetPasswordAsync({ token, newPassword: password });
            setIsSuccess(true);
        } catch (err) {
            // Error handled by hook
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center space-y-6">
                <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500 rounded-xl text-emerald-700 font-medium">
                    Your password has been successfully reset.
                </div>
                <Button
                    asChild
                    className="w-full border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)]"
                >
                    <Link href="/signin">Go to sign in</Link>
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    className="border-2 border-primary bg-background shadow-sm"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    className="border-2 border-primary bg-background shadow-sm"
                />
            </div>

            {localError || error ? (
                <p className="text-sm text-destructive font-medium">{localError || error?.message}</p>
            ) : null}

            <Button
                type="submit"
                className="w-full border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
                disabled={isPending}
            >
                {isPending ? "Resetting..." : "Reset password"}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border-2 border-border p-8 rounded-xl shadow-[8px_8px_0_0_var(--color-border)]">
                <div className="space-y-2 mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Set new password</h1>
                    <p className="text-muted-foreground">
                        Please enter your new password below.
                    </p>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </main>
    );
}
