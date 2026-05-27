"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { useSignup } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function SignupPage() {
    const router = useRouter();
    const { createUserWithEmailAndPasswordAsync, isPending, isSuccess, error } = useSignup();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await createUserWithEmailAndPasswordAsync({
                fullName,
                email,
                password,
            });
            toast.success("Account created successfully!");
            router.push("/dashboard/forms");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
            toast.error(message);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-card p-8 relative z-10">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to home
                    </Link>
                </div>
                <div className="space-y-2 mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Create account</h1>
                    <p className="text-muted-foreground">
                        Register with your name, email, and password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input
                            id="fullName"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            placeholder="Jane Doe"
                            required
                            className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="jane@example.com"
                            required
                            className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="••••••••"
                            required
                            className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                        />
                    </div>

                    {isSuccess ? <p className="text-sm text-primary font-medium">Account created successfully.</p> : null}

                    <Button
                        type="submit"
                        className="w-full rounded-full bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20 transition-all border border-white/10 hover:-translate-y-1"
                        disabled={isPending}
                    >
                        {isPending ? "Registering..." : "Register"}
                    </Button>
                    
                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Already have an account? <Link href="/signin" className="text-primary hover:underline font-medium">Sign in</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
