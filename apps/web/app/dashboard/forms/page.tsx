// apps/web/app/dashboard/forms/page.tsx

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, PencilLine, Plus, Settings2, Share, FileText, BarChart2 } from "lucide-react";

import { useCreateForm, useListForms } from "~/hooks/api/form";

import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

export default function DashboardForms() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState<"PUBLIC" | "UNLISTED">("PUBLIC");

    const { createFormAsync, error, status } = useCreateForm();
    const { forms, isLoading } = useListForms();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await createFormAsync({
            title: title.trim(),
            description: description.trim() ? description.trim() : undefined,
            visibility,
            status: "DRAFT",
        });

        setOpen(false);
        setTitle("");
        setDescription("");
        setVisibility("PUBLIC");
    };

    return (
        <main className="min-h-screen bg-background px-6 py-12 text-foreground">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-primary">Your Forms</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Manage your forms and view responses.</p>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-full bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border border-white/10 gap-2 px-6 py-6 text-lg hover:-translate-y-1">
                                <Plus className="size-5" />
                                Create New Form
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-panel text-foreground sm:max-w-lg border-white/10">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-primary">Create a New Form</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Start building your next beautiful form.
                                </DialogDescription>
                            </DialogHeader>

                            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label htmlFor="title" className="text-sm font-semibold text-primary">
                                        Title <span className="text-destructive">*</span>
                                    </label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        placeholder="e.g. Customer Feedback Survey"
                                        className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-sm font-semibold text-primary">
                                        Description (Optional)
                                    </label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                        placeholder="Briefly describe what this form is for..."
                                        className="min-h-[100px] border border-primary/30 bg-background/50 focus:bg-background shadow-sm resize-none rounded-lg"
                                    />
                                </div>

                                    <div className="space-y-2 col-span-2">
                                        <label htmlFor="visibility" className="text-sm font-semibold text-primary">
                                            Visibility
                                        </label>
                                        <select
                                            id="visibility"
                                            value={visibility}
                                            onChange={(e) => setVisibility(e.target.value as any)}
                                            className="w-full flex h-10 rounded-lg border border-primary/30 bg-background/50 focus:bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                                        >
                                            <option value="PUBLIC">Public</option>
                                            <option value="UNLISTED">Unlisted</option>
                                        </select>
                                    </div>


                                {error ? (
                                    <p className="text-sm text-destructive font-medium p-2 bg-destructive/10 rounded-md border border-destructive">{error.message}</p>
                                ) : null}

                                <DialogFooter className="mt-6 pt-4 border-t border-border/50">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                        className="rounded-full border-white/20 glass-card hover:bg-white/5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={status === "pending" || title.trim().length === 0}
                                        className="rounded-full bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20 transition-all border border-white/10"
                                    >
                                        {status === "pending" ? "Creating..." : "Create Form"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="glass-card p-6 flex flex-col justify-between h-[230px] animate-pulse">
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <div className="w-16 h-5 bg-primary/20 rounded-md" />
                                        <div className="w-16 h-5 bg-primary/20 rounded-md" />
                                    </div>
                                    <div className="w-3/4 h-6 bg-primary/20 rounded-md mb-3" />
                                    <div className="w-full h-4 bg-primary/10 rounded-md mb-2" />
                                    <div className="w-5/6 h-4 bg-primary/10 rounded-md" />
                                </div>
                                <div className="mt-6 pt-4 border-t border-border/50 flex justify-between">
                                    <div className="w-16 h-8 bg-primary/20 rounded-full" />
                                    <div className="flex gap-2">
                                        <div className="w-10 h-8 bg-primary/20 rounded-md" />
                                        <div className="w-10 h-8 bg-primary/20 rounded-md" />
                                    </div>
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
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded border-2 uppercase tracking-wider ${form.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 border-emerald-800' : 'bg-amber-100 text-amber-800 border-amber-800'}`}>
                                            {form.status || 'DRAFT'}
                                        </span>
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b-2 border-border">
                                            {form.visibility || 'PUBLIC'}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-primary truncate" title={form.title}>
                                        {form.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {form.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {/* Mock avatar stack for responses */}
                                        <div className="w-8 h-8 rounded-full border border-white/20 bg-primary/80 backdrop-blur-sm flex items-center justify-center text-[10px] text-white font-bold z-10 shadow-sm">+5</div>
                                        <div className="w-8 h-8 rounded-full border border-white/20 bg-secondary/80 backdrop-blur-sm z-0 shadow-sm"></div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="border-2 border-foreground shadow-[2px_2px_0_0_var(--color-foreground)] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground gap-2"
                                            title="View Submissions"
                                        >
                                            <Link href={`/form/${form.id}/submissions`}>
                                                <BarChart2 className="size-4" />
                                            </Link>
                                        </Button>

                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="border-2 border-foreground shadow-[2px_2px_0_0_var(--color-foreground)] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground gap-2"
                                            title="Edit Form"
                                        >
                                            <Link href={`/dashboard/forms/${form.id}`}>
                                                <PencilLine className="size-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full glass-card p-12 text-center flex flex-col items-center justify-center border-dashed">
                            <FileText className="w-12 h-12 text-primary/40 mb-4" />
                            <h3 className="text-xl font-bold text-foreground mb-2">No forms created yet</h3>
                            <p className="text-muted-foreground mb-6">Create your first form to start collecting responses.</p>
                            <Button onClick={() => setOpen(true)} className="rounded-full bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20 transition-all border border-white/10 hover:-translate-y-1">
                                <Plus className="size-4 mr-2" />
                                Create Form
                            </Button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
