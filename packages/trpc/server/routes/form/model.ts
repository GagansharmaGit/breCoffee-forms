import { z } from "zod";
import { fieldOutputModel } from "../form-field/model";

export const createFormInputModel = z.object({
    title: z.string().max(55).describe("Title of the form"),
    description: z.string().max(300).optional().describe("Description of the form"),
    visibility: z.enum(["PUBLIC", "UNLISTED"]).optional(),
    status: z.enum(["PUBLISHED", "DRAFT"]).optional(),
});

export const updateFormInputModel = z.object({
    id: z.string().describe("ID of the form to update"),
    title: z.string().max(55).optional().describe("Title of the form"),
    description: z.string().max(300).optional().describe("Description of the form"),
    visibility: z.enum(["PUBLIC", "UNLISTED"]).optional(),
    status: z.enum(["PUBLISHED", "DRAFT"]).optional(),
});

export const createFormOutputModel = z.object({
    id: z.string().describe("ID of the created form"),
});

export const updateFormOutputModel = z.object({
    success: z.boolean().describe("Whether the form update completed successfully"),
});

export const listFormsInputModel = z.undefined();
export const listFormsOutputModel = z.array(
    z.object({
        id: z.string().describe("ID of the form"),
        title: z.string().describe("Title of the form"),
        description: z.string().nullable().optional().describe("Description of the form"),
        visibility: z.enum(["PUBLIC", "UNLISTED"]).optional(),
        status: z.enum(["PUBLISHED", "DRAFT"]).optional(),
        createdAt: z.date().nullable().describe("Creation timestamp"),
        updatedAt: z.date().nullable().describe("Last updated timestamp"),
    }),
);

export const getFormInputModel = z.object({
    formId: z.uuid().describe("UUID of the form to fetch"),
});

export const getFormOutputModel = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    visibility: z.enum(["PUBLIC", "UNLISTED"]).optional(),
    status: z.enum(["PUBLISHED", "DRAFT"]).optional(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    fields: z.array(fieldOutputModel),
});
