"use client";

import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { Plus, GripVertical, Settings, Save, Eye, Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { useCreateField, useGetFields } from "~/hooks/api/form-field";
import { useGetFormWithFields, useUpdateForm } from "~/hooks/api/form";

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
import { Checkbox } from "~/components/ui/checkbox";

type FieldType = "TEXT" | "LONG_TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD" | "CHECKBOX" | "DROPDOWN" | "RATING" | "DATE" | "MULTI_SELECT";

export default function FormBuilder() {
    const params = useParams();
    const formId = params?.id as string | undefined;

    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState("");
    const [type, setType] = useState<FieldType>("TEXT");
    const [description, setDescription] = useState("");
    const [placeholder, setPlaceholder] = useState("");
    const [isRequired, setIsRequired] = useState(false);
    const [optionsText, setOptionsText] = useState("");

    const { createFieldAsync, status, error } = useCreateField(formId ?? "");
    const { fields, isLoading: fieldsLoading } = useGetFields(formId ?? "");
    const { form, isLoading: formLoading } = useGetFormWithFields(formId ?? "");
    const { updateFormAsync, status: updateStatus } = useUpdateForm();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formId) return;

        const options = ["DROPDOWN", "MULTI_SELECT", "CHECKBOX"].includes(type) && optionsText.trim()
            ? optionsText.split(",").map(s => s.trim()).filter(Boolean)
            : undefined;

        await createFieldAsync({
            label: label.trim(),
            type,
            formId,
            description: description.trim() ? description.trim() : undefined,
            placeholder: placeholder.trim() ? placeholder.trim() : undefined,
            isRequired,
            options,
        });

        setOpen(false);
        setLabel("");
        setType("TEXT");
        setDescription("");
        setPlaceholder("");
        setOptionsText("");
        setIsRequired(false);
    };

    const togglePublishStatus = async () => {
        if (!form) return;
        const newStatus = form.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
        await updateFormAsync({ id: form.id, status: newStatus });
    };

    return (
        <main className="min-h-screen bg-background px-6 py-12 text-foreground">
            <div className="mx-auto max-w-4xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Form Builder</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Add, remove, and configure fields for your form.</p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <Button asChild variant="outline" className="rounded-full glass-card border border-white/20 text-primary hover:bg-white/5">
                            <Link href={`/dashboard/forms`}>Back</Link>
                        </Button>
                        <Button 
                            variant="outline" 
                            className="rounded-full glass-card border border-white/20 text-primary hover:bg-white/5"
                            onClick={() => {
                                const url = `${window.location.origin}/form/${formId}`;
                                navigator.clipboard.writeText(url);
                                toast.success("Share link copied to clipboard!");
                            }}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Share Link
                        </Button>
                        <Button asChild variant="outline" className="rounded-full glass-card border border-white/20 text-primary hover:bg-white/5">
                            <Link href={`/form/${formId}`} target="_blank">
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Link>
                        </Button>
                        {form && (
                            <Button 
                                onClick={togglePublishStatus}
                                disabled={updateStatus === "pending"}
                                className={`rounded-full shadow-lg transition-all border border-white/10 hover:-translate-y-1 ${form.status === "PUBLISHED" ? "bg-amber-400 text-amber-950 hover:bg-amber-400/90 shadow-amber-400/20" : "bg-emerald-500 text-emerald-950 hover:bg-emerald-500/90 shadow-emerald-500/20"}`}
                            >
                                {updateStatus === "pending" ? "Saving..." : form.status === "PUBLISHED" ? "Unpublish" : "Publish Form"}
                            </Button>
                        )}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-full bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20 transition-all border border-white/10 hover:-translate-y-1">
                                    <Plus className="size-4 mr-2" />
                                    Add Field
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="glass-panel text-foreground sm:max-w-lg max-h-[90vh] overflow-y-auto border-white/10">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-primary">Create New Field</DialogTitle>
                                    <DialogDescription className="text-muted-foreground">
                                        Configure the new field for your form.
                                    </DialogDescription>
                                </DialogHeader>

                                <form className="space-y-5 mt-4" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-primary block">
                                            Field Label <span className="text-destructive">*</span>
                                        </label>
                                        <Input
                                            value={label}
                                            onChange={(e) => setLabel(e.target.value)}
                                            placeholder="e.g. What is your name?"
                                            className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-primary block">Field Type</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value as FieldType)}
                                            className="w-full h-10 rounded-lg border border-primary/30 bg-background/50 focus:bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm"
                                        >
                                            <option value="TEXT">Short Text</option>
                                            <option value="LONG_TEXT">Long Text</option>
                                            <option value="NUMBER">Number</option>
                                            <option value="EMAIL">Email</option>
                                            <option value="YES_NO">Yes / No</option>
                                            <option value="CHECKBOX">Checkbox</option>
                                            <option value="DROPDOWN">Dropdown</option>
                                            <option value="MULTI_SELECT">Multi Select</option>
                                            <option value="RATING">Rating</option>
                                            <option value="DATE">Date</option>
                                            <option value="PASSWORD">Password</option>
                                        </select>
                                    </div>

                                    {["DROPDOWN", "MULTI_SELECT", "CHECKBOX"].includes(type) && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-primary block">
                                                Options (Comma separated)
                                            </label>
                                            <Textarea
                                                value={optionsText}
                                                onChange={(e) => setOptionsText(e.target.value)}
                                                placeholder="Apple, Banana, Cherry"
                                                className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm resize-none h-20 rounded-lg"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-primary block">
                                            Description (Optional)
                                        </label>
                                        <Textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Helpful text for the respondent"
                                            className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm resize-none h-20 rounded-lg"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-primary block">
                                            Placeholder (Optional)
                                        </label>
                                        <Input
                                            value={placeholder}
                                            onChange={(e) => setPlaceholder(e.target.value)}
                                            placeholder="e.g. John Doe"
                                            className="border border-primary/30 bg-background/50 focus:bg-background shadow-sm rounded-lg"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 p-3 border border-primary/30 rounded-lg bg-background/50 shadow-sm">
                                        <Checkbox
                                            id="isRequired"
                                            checked={isRequired}
                                            onCheckedChange={(v) => setIsRequired(Boolean(v))}
                                            className="border border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                        />
                                        <label htmlFor="isRequired" className="text-sm font-semibold text-primary cursor-pointer select-none">
                                            This field is required
                                        </label>
                                    </div>

                                    {error ? (
                                        <p className="text-sm text-destructive font-medium p-2 bg-destructive/10 rounded-md border border-destructive">{error.message}</p>
                                    ) : null}

                                    <DialogFooter className="pt-4 border-t border-border/50 mt-6">
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
                                            disabled={status === "pending" || !label.trim()}
                                            className="rounded-full bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20 transition-all border border-white/10 hover:-translate-y-1"
                                        >
                                            {status === "pending" ? "Creating..." : "Save Field"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="glass-card overflow-hidden min-h-[500px] flex flex-col border border-white/10 shadow-xl shadow-black/5">
                    <div className="bg-background/40 backdrop-blur-md p-4 border-b border-border/50 flex items-center justify-between">
                        <h2 className="font-semibold text-foreground">Form Canvas</h2>
                        <span className="text-xs font-bold px-2 py-1 glass-card border-white/10 rounded text-muted-foreground">
                            {fields?.length || 0} Fields
                        </span>
                    </div>

                    <div className="flex-1 p-6 bg-transparent">
                        <section className="flex flex-col gap-4">
                            {fieldsLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="glass-card p-6 rounded-lg animate-pulse h-[100px] flex items-center justify-between border-white/10">
                                        <div className="flex-1 space-y-3">
                                            <div className="w-32 h-5 bg-primary/20 rounded-md" />
                                            <div className="w-64 h-4 bg-primary/10 rounded-md" />
                                        </div>
                                        <div className="w-20 h-6 bg-primary/20 rounded-md" />
                                    </div>
                                ))
                            ) : fields && fields.length > 0 ? (
                                fields.map((f, i) => (
                                    <div
                                        key={f.id}
                                        className="group relative glass-card p-4 flex gap-4 items-center hover:border-primary/50 transition-colors shadow-sm"
                                    >
                                        <div className="text-muted-foreground/50 cursor-grab hover:text-primary transition-colors">
                                            <GripVertical className="size-5" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-primary/40 w-4">{i + 1}.</span>
                                                <h3 className="font-bold text-primary truncate">{f.label}</h3>
                                                {f.isRequired && <span className="text-destructive text-lg leading-none">*</span>}
                                            </div>
                                            {f.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-1 ml-6">{f.description}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0">
                                            <span className="text-xs font-bold px-2 py-1 bg-secondary/20 text-secondary-foreground border border-secondary/30 rounded-md uppercase tracking-wider hidden sm:block">
                                                {f.type.replace('_', ' ')}
                                            </span>
                                            
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                <Settings className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="border border-dashed border-primary/30 glass-card p-12 text-center flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                        <Plus className="w-8 h-8 text-primary/60" />
                                    </div>
                                    <p className="text-lg font-bold text-foreground mb-2">No fields added yet</p>
                                    <p className="text-muted-foreground">Click "Add Field" to start building your form.</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
