import { z } from "zod";

const fieldTypeEnum = z.enum(["TEXT", "LONG_TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD", "CHECKBOX", "DROPDOWN", "RATING", "DATE", "MULTI_SELECT"]);

export const createFieldInput = z.object({
    label: z.string().max(100).describe("Display label for the field"),
    type: fieldTypeEnum.describe("Type of the field"),
    formId: z.uuid().describe("UUID of the form this field belongs to"),
    description: z.string().optional().describe("Helper text shown below the field"),
    placeholder: z.string().optional().describe("Placeholder text for the field"),
    isRequired: z.boolean().optional().default(false).describe("Whether the field is required"),
    options: z.array(z.string()).optional().describe("Options for dropdowns, multi-selects, etc"),
});

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const getFieldsInput = z.object({
    formId: z.uuid().describe("UUID of the form to fetch the fields for"),
});

export type GetFieldsInputType = z.infer<typeof getFieldsInput>;
