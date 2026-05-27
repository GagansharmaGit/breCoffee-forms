import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";

import {
    createFormInputModel,
    createFormOutputModel,
    listFormsInputModel,
    listFormsOutputModel,
    getFormInputModel,
    getFormOutputModel,
    updateFormInputModel,
    updateFormOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
    createForm: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(createFormInputModel)
        .output(createFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { title, description, visibility, status } = input;

            const { id } = await formService.createForm({
                title,
                description,
                visibility,
                status,
                createdBy: ctx.user.id,
            });

            return { id };
        }),
    updateForm: authenticatedProcedure
        .meta({
            openapi: {
                method: "PUT",
                path: getPath("/updateForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(updateFormInputModel)
        .output(updateFormOutputModel)
        .mutation(async ({ input }) => {
            await formService.updateForm(input as any);
            return { success: true };
        }),
    listForms: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/listForms"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(listFormsInputModel)
        .output(listFormsOutputModel)
        .query(async ({ ctx }) => {
            const forms = await formService.listFormsByUserId({ userId: ctx.user.id });
            return forms;
        }),
    listPublicForms: publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/listPublicForms"),
                tags: TAGS,
            },
        })
        .input(listFormsInputModel)
        .output(listFormsOutputModel)
        .query(async () => {
            const forms = await formService.listPublicForms();
            return forms;
        }),
    getFormWithFields: publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getForm"),
                tags: TAGS,
            },
        })
        .input(getFormInputModel)
        .output(getFormOutputModel)
        .query(async ({ input }) => {
            const { formId } = input;
            const form = await formService.getFormWithFields(formId);
            return form;
        }),
});
