"use client";

import { useLogout, useUser } from "~/hooks/api/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Home, User, Compass } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { mutateAsync: logoutAsync } = useLogout();
    const { user, isLoading } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        await logoutAsync();
        router.push("/signin");
    };

    if (isLoading) return null;

    if (!user) {
        router.push("/signin");
        return null;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b-2 border-border bg-card shadow-sm sticky top-0 z-50">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded border border-white/20 shadow-sm flex items-center justify-center">
                                <span className="font-black text-primary-foreground text-sm">☕</span>
                            </div>
                            <span className="font-bold text-xl text-primary tracking-tight">brewCoffee</span>
                        </Link>
                        
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard/forms" className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2">
                                <Home className="w-4 h-4" /> My Forms
                            </Link>
                            <Link href="/explore" className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2">
                                <Compass className="w-4 h-4" /> Explore
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-border bg-background">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground max-w-[150px] truncate">
                                {user.email}
                            </span>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleLogout}
                            className="border-2 border-foreground shadow-[2px_2px_0_0_var(--color-foreground)] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
