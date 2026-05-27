"use client";

import Link from "next/link";
import { Compass, ExternalLink } from "lucide-react";
import { useListPublicForms } from "~/hooks/api/form";
import { useUser } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";

export default function ExplorePage() {
    const { forms, isLoading } = useListPublicForms();
    const { user } = useUser();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-border/40 bg-background/50 backdrop-blur-lg sticky top-0 z-50">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <span className="font-black text-primary text-sm">☕</span>
                        </div>
                        <span className="font-bold text-xl text-primary tracking-tight">brewCoffee</span>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Button asChild className="rounded-full bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border border-white/10">
                                <Link href="/dashboard/forms">Dashboard</Link>
                            </Button>
                        ) : (
                            <Button asChild className="rounded-full bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border border-white/10">
                                <Link href="/signin">Sign In</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 px-6 py-12 text-foreground">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <Compass className="w-10 h-10 text-primary" />
                            Explore Forms
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Discover forms created by the brewCoffee community. Get inspired and share your own.
                        </p>
                    </div>

                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="glass-card p-6 flex flex-col justify-between h-[230px] animate-pulse">
                                    <div>
                                        <div className="flex justify-between mb-4">
                                            <div className="w-16 h-5 bg-primary/20 rounded-md" />
                                        </div>
                                        <div className="w-3/4 h-6 bg-primary/20 rounded-md mb-3" />
                                        <div className="w-full h-4 bg-primary/10 rounded-md mb-2" />
                                        <div className="w-5/6 h-4 bg-primary/10 rounded-md" />
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
                                        <div className="w-24 h-10 bg-primary/20 rounded-md" />
                                    </div>
                                </div>
                            ))
                        ) : forms && forms.length > 0 ? (
                            forms.map((form) => (
                                <article
                                    key={form.id}
                                    className="group relative glass-card p-6 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary border-2 border-primary/20 rounded uppercase tracking-wider">
                                                Public
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-primary truncate" title={form.title}>
                                            {form.title}
                                        </h2>
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                                            {form.description || "No description provided."}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-end">
                                        <Button
                                            asChild
                                            className="w-full border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none bg-primary text-primary-foreground hover:bg-primary/90"
                                        >
                                            <Link href={`/form/${form.id}`} target="_blank">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Fill Form
                                            </Link>
                                        </Button>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full glass-card p-12 text-center flex flex-col items-center justify-center border-dashed">
                                <Compass className="w-12 h-12 text-primary/40 mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">No public forms yet</h3>
                                <p className="text-muted-foreground mb-6">Be the first to publish a public form!</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
