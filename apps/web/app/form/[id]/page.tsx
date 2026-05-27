"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, AlertCircle, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

import { useGetFormWithFields } from "~/hooks/api/form";
import { useCreateSubmission } from "~/hooks/api/form-submission";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

type FieldType = "TEXT" | "LONG_TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD" | "CHECKBOX" | "DROPDOWN" | "RATING" | "DATE" | "MULTI_SELECT";

// Play a satisfying pop sound using native Web Audio API
const playPopSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        // Ignore audio errors
    }
};

function RatingInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const rating = parseInt(value) || 0;
    return (
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onChange(String(n))}
                    className={`transition-all duration-150 ${n <= rating ? "text-primary scale-110" : "text-muted-foreground/30 hover:text-primary/50"}`}
                >
                    <Star className="w-8 h-8 fill-current" />
                </button>
            ))}
        </div>
    );
}

function FieldRenderer({
    field,
    value,
    onChange,
}: {
    field: { id: string; label: string; type: FieldType; placeholder?: string | null; description?: string | null; isRequired: boolean; options?: string[] | null };
    value: string;
    onChange: (v: string) => void;
}) {
    const base = "border-2 border-primary bg-background shadow-sm focus:ring-2 focus:ring-primary/50 transition-all";

    switch (field.type) {
        case "LONG_TEXT":
            return (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    required={field.isRequired}
                    rows={4}
                    className={`${base} w-full rounded-md px-3 py-2 text-sm resize-none outline-none`}
                />
            );
        case "NUMBER":
            return (
                <Input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    required={field.isRequired}
                    className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                />
            );
        case "EMAIL":
            return (
                <Input
                    type="email"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    required={field.isRequired}
                    className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                />
            );
        case "PASSWORD":
            return (
                <Input
                    type="password"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    required={field.isRequired}
                    className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                />
            );
        case "YES_NO":
            return (
                <div className="flex gap-4">
                    {["Yes", "No"].map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => onChange(opt === "Yes" ? "true" : "false")}
                            className={`flex-1 py-3 rounded-lg border-2 font-bold text-sm transition-all ${
                                (opt === "Yes" && value === "true") || (opt === "No" && value === "false")
                                    ? "border-primary bg-primary text-primary-foreground shadow-[3px_3px_0_0_var(--color-foreground)]"
                                    : "border-border bg-background hover:border-primary"
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            );
        case "CHECKBOX":
            return (
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                        onClick={() => onChange(value === "true" ? "false" : "true")}
                        className={`w-6 h-6 rounded border-2 border-primary flex items-center justify-center transition-all cursor-pointer ${
                            value === "true" ? "bg-primary" : "bg-background hover:bg-primary/10"
                        }`}
                    >
                        {value === "true" && <span className="text-primary-foreground text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {field.placeholder || "Yes, I agree"}
                    </span>
                </label>
            );
        case "DROPDOWN":
            return (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.isRequired}
                    className={`${base} w-full h-10 rounded-md px-3 py-2 text-sm outline-none`}
                >
                    <option value="">Select an option...</option>
                    {(field.options && field.options.length > 0 ? field.options : ["Option A", "Option B", "Option C"])
                        .map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                </select>
            );
        case "MULTI_SELECT":
            const options = field.options && field.options.length > 0 ? field.options : ["Option A", "Option B", "Option C"];
            const selected = value ? value.split(",").filter(Boolean) : [];
            const toggleOpt = (opt: string) => {
                const next = selected.includes(opt)
                    ? selected.filter((s) => s !== opt)
                    : [...selected, opt];
                onChange(next.join(","));
            };
            return (
                <div className="flex flex-wrap gap-2">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => toggleOpt(opt)}
                            className={`px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                                selected.includes(opt)
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background hover:border-primary"
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            );
        case "RATING":
            return <RatingInput value={value} onChange={onChange} />;
        case "DATE":
            return (
                <Input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.isRequired}
                    className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                />
            );
        default: // TEXT
            return (
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    required={field.isRequired}
                    className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                />
            );
    }
}

export default function PublicFormPage() {
    const params = useParams();
    const formId = params?.id as string | undefined;

    const { form, isLoading } = useGetFormWithFields(formId ?? "");
    const { createSubmissionAsync, status, error } = useCreateSubmission();

    const [values, setValues] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!form?.fields) return;
        const initial: Record<string, string> = {};
        for (const f of form.fields) initial[f.id] = "";
        setValues(initial);
    }, [form?.fields]);

    const handleChange = (fieldId: string, v: string) => {
        setValues((s) => ({ ...s, [fieldId]: v }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formId) return;

        const payload = {
            formId,
            values: Object.entries(values).map(([fieldId, value]) => ({ fieldId, value })),
        };

        await createSubmissionAsync(payload);
        playPopSound();
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#primary", "#foreground", "#background"],
        });
        setSubmitted(true);
        setValues((s) => Object.fromEntries(Object.keys(s).map((k) => [k, ""])));
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading form…</p>
                </div>
            </main>
        );
    }

    if (!form) {
        return (
            <main className="min-h-screen flex items-center justify-center p-6 relative z-10">
                <div className="text-center glass-card p-8 max-w-sm">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-foreground">Form not found</h2>
                    <p className="text-muted-foreground mt-2">This form may have been removed or the link is invalid.</p>
                </div>
            </main>
        );
    }

    if (submitted) {
        return (
            <main className="min-h-screen flex items-center justify-center p-6 relative z-10">
                <div className="text-center glass-card p-10 max-w-sm w-full">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Submitted!</h2>
                    <p className="text-muted-foreground">Thanks — your response has been recorded.</p>
                    <Button
                        onClick={() => setSubmitted(false)}
                        className="mt-6 border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        Submit another response
                    </Button>
                </div>
            </main>
        );
    }

    const sortedFields = [...(form.fields ?? [])].sort((a, b) => parseFloat(a.index) - parseFloat(b.index));

    return (
        <main className="min-h-screen py-12 px-4 relative z-10 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <div className="absolute -top-12 left-0 mb-4">
                    <Link href="/explore" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        ← Back to Explore
                    </Link>
                </div>
                {/* Form Header */}
                <div className="bg-primary/90 backdrop-blur-md border border-white/20 text-primary-foreground p-8 rounded-t-xl shadow-lg shadow-primary/20">
                    <h1 className="text-3xl font-bold tracking-tight">{form.title}</h1>
                    {form.description && (
                        <p className="mt-2 text-primary-foreground/80 text-base">{form.description}</p>
                    )}
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    className="glass-card p-8 rounded-t-none rounded-b-xl space-y-8 w-full"
                >
                    {sortedFields.map((f, i) => (
                        <div key={f.id} className="group">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-sm font-bold text-primary/40 mt-0.5 w-5 shrink-0">{i + 1}.</span>
                                <div className="flex-1">
                                    <label className="block font-semibold text-foreground text-base mb-1">
                                        {f.label}
                                        {f.isRequired && <span className="text-destructive ml-1">*</span>}
                                    </label>
                                    {f.description && (
                                        <p className="text-sm text-muted-foreground mb-3">{f.description}</p>
                                    )}
                                    <motion.div whileFocus={{ scale: 1.01 }} className="origin-left">
                                        <FieldRenderer
                                            field={f as any}
                                            value={values[f.id] ?? ""}
                                            onChange={(v) => handleChange(f.id, v)}
                                        />
                                    </motion.div>
                                </div>
                            </div>
                            {i < sortedFields.length - 1 && (
                                <div className="mt-6 border-b-2 border-dashed border-border/50" />
                            )}
                        </div>
                    ))}

                    {error && (
                        <div className="p-4 border-2 border-destructive bg-destructive/10 rounded-lg text-sm text-destructive font-medium flex gap-2 items-center">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error.message}
                        </div>
                    )}

                    <div className="pt-4 border-t-2 border-border flex justify-end">
                        <Button
                            type="submit"
                            disabled={status === "pending"}
                            className="px-8 py-6 text-base border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {status === "pending" ? "Submitting…" : "Submit Response →"}
                        </Button>
                    </div>
                </form>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    Powered by <Link href="/" className="font-bold text-primary hover:underline">brewCoffee</Link>
                </p>
            </div>
        </main>
    );
}
