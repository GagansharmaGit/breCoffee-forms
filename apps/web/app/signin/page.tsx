"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { env } from "~/env.js";
import { useSignin, useGenerateOTP, useVerifyOTP } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function SigninPage() {
    const router = useRouter();
    const isOTPEnabled = env.NEXT_PUBLIC_ENABLE_OTP_LOGIN;

    const { signInUserWithEmailAndPasswordAsync, isPending: isSigninPending } = useSignin();
    const { mutateAsync: generateOTPAsync, isPending: isGeneratingOTP } = useGenerateOTP();
    const { mutateAsync: verifyOTPAsync, isPending: isVerifyingOTP } = useVerifyOTP();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    
    const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
    const [message, setMessage] = useState("");

    const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await signInUserWithEmailAndPasswordAsync({ email, password });
            toast.success("Signed in successfully!");
            router.push("/dashboard/forms");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Sign in failed. Please try again.";
            toast.error(message);
        }
    };

    const handleOTPSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");
        
        try {
            if (step === "EMAIL") {
                await generateOTPAsync({ email });
                setStep("OTP");
                setMessage("An OTP has been sent to your email.");
                toast.success("OTP sent to your email!");
            } else {
                await verifyOTPAsync({ email, code });
                toast.success("Signed in successfully!");
                router.push("/dashboard/forms");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
            toast.error(message);
        }
    };

    const renderPasswordForm = () => (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
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
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
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

            <Button
                type="submit"
                className="w-full rounded-full bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20 transition-all border border-white/10 hover:-translate-y-1"
                disabled={isSigninPending}
            >
                {isSigninPending ? "Signing in..." : "Sign in"}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account? <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
            </p>
        </form>
    );

    const renderOTPForm = () => (
        <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="jane@example.com"
                    disabled={step === "OTP"}
                    required
                    className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                />
            </div>

            {step === "OTP" && (
                <div className="space-y-2">
                    <Label htmlFor="code">OTP Code</Label>
                    <Input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        placeholder="123456"
                        required
                        className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm text-center tracking-widest text-lg rounded-lg"
                        maxLength={6}
                    />
                </div>
            )}

            {message ? <p className="text-sm text-primary font-medium">{message}</p> : null}

            <Button
                type="submit"
                className="w-full rounded-full bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20 transition-all border border-white/10 hover:-translate-y-1"
                disabled={isGeneratingOTP || isVerifyingOTP}
            >
                {step === "EMAIL" 
                    ? (isGeneratingOTP ? "Sending OTP..." : "Send OTP")
                    : (isVerifyingOTP ? "Verifying..." : "Verify & Sign in")}
            </Button>

            {step === "OTP" && (
                <Button
                    type="button"
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => { setStep("EMAIL"); setCode(""); setMessage(""); }}
                >
                    Use a different email
                </Button>
            )}

            <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account? <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
            </p>
        </form>
    );

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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
                    <p className="text-muted-foreground">
                        {isOTPEnabled ? "Sign in using a one-time password." : "Enter your credentials to access your account."}
                    </p>
                </div>

                {isOTPEnabled ? renderOTPForm() : renderPasswordForm()}
            </div>
        </main>
    );
}

