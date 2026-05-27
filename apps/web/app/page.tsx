"use client";

import Link from "next/link";
import { ArrowRight, FileText, Share2, Sparkles, Database } from "lucide-react";
import { useUser } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";

export default function Home() {
    const { user, isLoading } = useUser();

    return (
        <div className="min-h-screen text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground relative z-0">
            {/* Navigation */}
            <header className="border-b border-border/40 bg-background/50 backdrop-blur-lg sticky top-0 z-50">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <span className="font-black text-primary text-sm">☕</span>
                            </div>
                            <span className="font-bold text-xl text-primary tracking-tight">brewCoffee</span>
                        </Link>
                        
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="#features" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Features</Link>
                            <Link href="#pricing" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Upcoming (Payments)</Link>
                            <Link href="/explore" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Explore</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isLoading && (
                            user ? (
                                <Button asChild className="rounded-full bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border border-white/10">
                                    <Link href="/dashboard/forms">Go to Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Link href="/signin" className="text-sm font-bold text-foreground/80 hover:text-primary hidden sm:block">Sign in</Link>
                                    <Button asChild className="rounded-full bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border border-white/10">
                                        <Link href="/signup">Get Started</Link>
                                    </Button>
                                </>
                            )
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative px-6 py-24 md:py-32 lg:py-40 overflow-hidden">
                    <div className="mx-auto max-w-5xl text-center flex flex-col items-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-primary bg-primary/10 text-primary font-bold text-sm mb-8 shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            <span>The easiest way to build beautiful forms</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight leading-tight mb-6 drop-shadow-sm">
                            Brew powerful forms <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-pulse">in minutes.</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mb-10 font-medium leading-relaxed">
                            brewCoffee is the beautiful, smooth form builder you've been waiting for. Collect responses, analyze data, and build your community with a fresh brew.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-primary/90 text-primary-foreground hover:bg-primary shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all border border-white/10 hover:-translate-y-1">
                                <Link href="/signup">
                                    Start building for free <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full glass-card hover:bg-white/5 border border-white/20 hover:border-white/40">
                                <Link href="/explore">
                                    Explore forms
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section - Bento Grid */}
                <section id="features" className="px-6 py-24 relative z-10">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Everything you need</h2>
                            <p className="text-lg text-muted-foreground mt-4">Simple, powerful, and beautiful.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {/* Large Item */}
                            <div className="glass-card p-8 md:col-span-2 row-span-2 group">
                                <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-8 border border-primary/30 group-hover:scale-110 transition-transform duration-500">
                                    <FileText className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4 text-foreground">Intuitive Builder</h3>
                                <p className="text-muted-foreground font-medium text-lg max-w-md">Drag, drop, and configure fields instantly. Our builder feels like brewing a fresh cup of coffee—smooth and satisfying. No code required.</p>
                            </div>
                            
                            {/* Small Item 1 */}
                            <div className="glass-card p-8 group">
                                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-6 border border-accent/30 group-hover:scale-110 transition-transform duration-500">
                                    <Share2 className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-foreground">Easy Sharing</h3>
                                <p className="text-muted-foreground font-medium">Publish with one click. Share a direct link instantly.</p>
                            </div>
                            
                            {/* Small Item 2 */}
                            <div className="glass-card p-8 group">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                                    <Database className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-foreground">Analytics</h3>
                                <p className="text-muted-foreground font-medium">View responses in real-time or export to CSV.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Pricing Section */}
                <section id="pricing" className="px-6 py-24 relative z-10">
                    <div className="mx-auto max-w-5xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Upcoming: Payments</h2>
                            <p className="text-lg text-muted-foreground mt-4">We are brewing up a robust payment system. Here's a sneak peek of what's coming.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto opacity-80 hover:opacity-100 transition-opacity duration-500">
                            {/* Free Tier */}
                            <div className="glass-card p-10 flex flex-col relative grayscale hover:grayscale-0 transition-all duration-500">
                                <h3 className="text-2xl font-bold text-foreground mb-2">Espresso (Soon)</h3>
                                <div className="text-5xl font-black text-primary mb-6">$0<span className="text-xl text-muted-foreground font-medium">/mo</span></div>
                                <p className="text-muted-foreground mb-8 font-medium">Perfect for quick surveys and individuals getting started.</p>
                                
                                <ul className="space-y-4 mb-10 flex-1 font-medium text-foreground/80">
                                    <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary/60" /> Unlimited Forms</li>
                                    <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary/60" /> 100 Responses / month</li>
                                    <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary/60" /> Standard Fields</li>
                                </ul>
                                
                                <Button asChild size="lg" className="w-full text-lg rounded-full glass-card hover:bg-white/5 border border-white/10 pointer-events-none text-foreground/50">
                                    <span>Not available yet</span>
                                </Button>
                            </div>
                            
                            {/* Pro Tier */}
                            <div className="glass-card p-10 flex flex-col relative transform md:-translate-y-4 border-primary/30 shadow-primary/10 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                                    <span className="bg-primary/20 backdrop-blur-md text-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border border-primary/30 shadow-lg">Upcoming</span>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Venti (Soon)</h3>
                                <div className="text-5xl font-black text-primary mb-6">$12<span className="text-xl text-muted-foreground font-medium">/mo</span></div>
                                <p className="text-muted-foreground mb-8 font-medium">For professionals and teams who need more power.</p>
                                
                                <ul className="space-y-4 mb-10 flex-1 font-medium text-foreground/80">
                                    <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary/60" /> Unlimited Forms</li>
                                    <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary/60" /> Unlimited Responses</li>
                                    <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary/60" /> Accept Payments via Stripe</li>
                                    <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary/60" /> Priority Support</li>
                                </ul>
                                
                                <Button asChild size="lg" className="w-full text-lg rounded-full bg-primary/20 text-primary pointer-events-none border border-primary/30">
                                    <span>Coming Soon</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-background/20 backdrop-blur-lg border-t border-white/10 py-12 px-6 relative z-10">
                <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <span className="font-black text-primary text-sm">☕</span>
                        </div>
                        <span className="font-bold text-primary">brewCoffee</span>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
                        © {new Date().getFullYear()} brewCoffee. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link href="https://x.com/GaganCodesx" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Twitter</Link>
                        <Link href="https://github.com/GagansharmaGit" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">GitHub</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
