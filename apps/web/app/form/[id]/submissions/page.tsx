"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, BarChart2, Users, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

import { useGetSubmissionsByFormId } from "~/hooks/api/form-submission";
import { useGetFields } from "~/hooks/api/form-field";
import { useGetFormWithFields } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";

type Submission = {
    id: string;
    formId?: string | null;
    values?: { fieldId: string; value: string }[] | null;
    createdAt?: string | null;
    updatedAt?: string | null;
};

export default function FormSubmissions() {
    const params = useParams();
    const formId = params?.id as string | undefined;

    const { submissions, isLoading: subsLoading, error } = useGetSubmissionsByFormId(formId ?? "");
    const { fields, isLoading: fieldsLoading } = useGetFields(formId ?? "");
    const { form, isLoading: formLoading } = useGetFormWithFields(formId ?? "");

    const rows = useMemo(() => (submissions ?? []) as Submission[], [submissions]);
    const sortedFields = useMemo(
        () => [...(fields ?? [])].sort((a, b) => parseFloat(a.index) - parseFloat(b.index)),
        [fields],
    );

    const chartData = useMemo(() => {
        const counts: Record<string, number> = {};
        const sortedSubmissions = [...rows].sort((a, b) => {
            return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        });
        sortedSubmissions.forEach((r) => {
            if (!r.createdAt) return;
            const dateStr = new Date(r.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
            counts[dateStr] = (counts[dateStr] || 0) + 1;
        });
        return Object.entries(counts).map(([date, count]) => ({ date, count }));
    }, [rows]);

    const loading = subsLoading || fieldsLoading || formLoading;

    if (loading) {
        return (
            <main className="min-h-screen bg-background py-12 px-6 text-foreground">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-md bg-primary/20 animate-pulse" />
                            <div>
                                <div className="w-48 h-8 bg-primary/20 rounded-md mb-2 animate-pulse" />
                                <div className="w-32 h-4 bg-primary/10 rounded-md animate-pulse" />
                            </div>
                        </div>
                        <div className="w-32 h-10 rounded-md bg-primary/20 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="glass-card p-5 h-24 animate-pulse" />
                        ))}
                    </div>
                    <div className="glass-card h-[400px] animate-pulse" />
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="text-center border-2 border-destructive bg-destructive/10 p-8 rounded-xl max-w-sm">
                    <p className="text-destructive font-semibold">Error loading submissions</p>
                    <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background py-12 px-6 text-foreground">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="outline" size="icon" className="border-2 border-primary text-primary hover:bg-primary/10 h-10 w-10">
                            <Link href="/dashboard/forms">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-primary">{form?.title ?? "Submissions"}</h1>
                            <p className="text-muted-foreground text-sm mt-0.5">Response analytics & data</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="border-2 border-primary text-primary hover:bg-primary/10 gap-2"
                        onClick={() => {
                            if (!rows.length) return;
                            const headers = ["Submission ID", "Submitted At", ...sortedFields.map((f) => f.label)];
                            const csvRows = rows.map((r) => [
                                r.id,
                                r.createdAt ? new Date(r.createdAt).toLocaleString() : "-",
                                ...sortedFields.map((f) => r.values?.find((v) => v.fieldId === f.id)?.value ?? "-"),
                            ]);
                            const csv = [headers, ...csvRows].map((row) => row.join(",")).join("\n");
                            const blob = new Blob([csv], { type: "text/csv" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `submissions-${formId}.csv`;
                            a.click();
                        }}
                    >
                        <Download className="size-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="border-2 border-foreground bg-card p-5 rounded-xl shadow-[4px_4px_0_0_var(--color-foreground)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">{rows.length}</p>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Responses</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-2 border-foreground bg-card p-5 rounded-xl shadow-[4px_4px_0_0_var(--color-foreground)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <BarChart2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">{sortedFields.length}</p>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fields</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-2 border-foreground bg-card p-5 rounded-xl shadow-[4px_4px_0_0_var(--color-foreground)] col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-primary truncate">
                                    {rows[0]?.createdAt ? new Date(rows[0].createdAt).toLocaleDateString() : "—"}
                                </p>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Response</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Chart */}
                {rows.length > 0 && (
                    <div className="border-2 border-foreground bg-card p-6 rounded-xl shadow-[4px_4px_0_0_var(--color-foreground)] mb-8">
                        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            <BarChart2 className="w-5 h-5" />
                            Submission Trend
                        </h2>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
                                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "var(--color-card)",
                                            borderColor: "var(--color-foreground)",
                                            borderRadius: "8px",
                                            borderWidth: "2px"
                                        }}
                                    />
                                    <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Table */}
                {rows.length === 0 ? (
                    <div className="border-2 border-dashed border-primary/40 bg-primary/5 p-12 text-center rounded-xl">
                        <Users className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">No submissions yet</h3>
                        <p className="text-muted-foreground mb-6">Share your form to start collecting responses.</p>
                        <Button asChild className="border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)]">
                            <Link href={`/form/${formId}`} target="_blank">View Form →</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="border-2 border-foreground rounded-xl shadow-[8px_8px_0_0_var(--color-foreground)] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-primary text-primary-foreground">
                                    <tr>
                                        <th className="px-5 py-3 text-left font-bold whitespace-nowrap text-xs uppercase tracking-wider">Submitted At</th>
                                        {sortedFields.map((f) => (
                                            <th key={f.id} className="px-5 py-3 text-left font-bold whitespace-nowrap text-xs uppercase tracking-wider">
                                                {f.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-border bg-card">
                                    {rows.map((r, i) => (
                                        <tr key={r.id} className={i % 2 === 0 ? "bg-card" : "bg-secondary/10"}>
                                            <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                                                {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                                            </td>
                                            {sortedFields.map((f) => {
                                                const v = r.values?.find((x) => x.fieldId === f.id);
                                                return (
                                                    <td key={f.id} className="px-5 py-3 text-foreground max-w-[200px] truncate" title={v?.value ?? "—"}>
                                                        {v?.value || <span className="text-muted-foreground/50">—</span>}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
