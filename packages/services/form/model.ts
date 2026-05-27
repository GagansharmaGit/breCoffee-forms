import { z } from "zod";

export const createFormInput = z.object({
    title: z.string().max(50).describe("Title of the form"),
    description: z.string().max(300).optional().describe("Description of the form"),
    visibility: z.enum(["PUBLIC", "UNLISTED"]).optional().describe("Visibility of the form"),
    status: z.enum(["PUBLISHED", "DRAFT"]).optional().describe("Status of the form"),
    theme: z.string().max(50).optional().describe("Theme of the form"),
    createdBy: z.string().describe("UUID of the creator"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const listFormsByUserIdInput = z.object({
    userId: z.string().describe("UUID of the user"),
});

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>;

export const updateFormInput = z.object({
    id: z.string().describe("UUID of the form"),
    title: z.string().max(50).optional().describe("Title of the form"),
    description: z.string().max(300).optional().describe("Description of the form"),
    visibility: z.enum(["PUBLIC", "UNLISTED"]).optional().describe("Visibility of the form"),
    status: z.enum(["PUBLISHED", "DRAFT"]).optional().describe("Status of the form"),
    theme: z.string().max(50).optional().describe("Theme of the form"),
});

export type UpdateFormInputType = z.infer<typeof updateFormInput>;
