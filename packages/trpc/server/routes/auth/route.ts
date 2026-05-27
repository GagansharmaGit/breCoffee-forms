import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { TRPCError } from "@trpc/server";
import {
    createUserWithEmailAndPasswordInputModel,
    createUserWithEmailAndPasswordOutputModel,
    signInUserWithEmailAndPasswordInputModel,
    signInUserWithEmailAndPasswordOutputModel,
    getLoggedInUserInfoInputModel,
    getLoggedInUserInfoOutputModel,
    generateOTPInputModel,
    generateOTPOutputModel,
    verifyOTPInputModel,
    verifyOTPOutputModel,
    forgetPasswordInputModel,
    forgetPasswordOutputModel,
    resetPasswordInputModel,
    resetPasswordOutputModel,
    logoutInputModel,
    logoutOutputModel,
} from "./model";

import { userService } from "../../services";

import { generatePath } from "../../utils/path-generator";
const getPath = generatePath("/authentication");
const TAGS = ["Authentication"];

/** Helper: convert service errors to TRPCError with a user-friendly message */
function toTRPCError(err: unknown): TRPCError {
    if (err instanceof TRPCError) return err;
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return new TRPCError({ code: "BAD_REQUEST", message });
}

export const authRouter = router({
    createUserWithEmailAndPassword: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createUserWithEmailAndPassword"),
                tags: TAGS,
            },
        })
        .input(createUserWithEmailAndPasswordInputModel)
        .output(createUserWithEmailAndPasswordOutputModel)
        .mutation(async ({ input, ctx }) => {
            try {
                const { fullName, email, password } = input;

                const { id, token } = await userService.createUserWithEmailAndPassword({
                    fullName,
                    email,
                    password,
                });

                ctx.setCookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                });

                return { id };
            } catch (err) {
                throw toTRPCError(err);
            }
        }),
    signInUserWithEmailAndPassword: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/signInUserWithEmailAndPassword"),
                tags: TAGS,
            },
        })
        .input(signInUserWithEmailAndPasswordInputModel)
        .output(signInUserWithEmailAndPasswordOutputModel)
        .mutation(async ({ input, ctx }) => {
            try {
                const { email, password } = input;

                const { id, token } = await userService.signInUserWithEmailAndPassword({
                    email,
                    password,
                });

                ctx.setCookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                });

                return { id };
            } catch (err) {
                throw toTRPCError(err);
            }
        }),
    getLoggedInUserInfo: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getLoggedInUserInfo"),
                tags: TAGS,
            },
        })
        .input(getLoggedInUserInfoInputModel)
        .output(getLoggedInUserInfoOutputModel)
        .query(async ({ ctx }) => {
            try {
                const { id, fullName, email } = await userService.getUserInfoById(ctx.user.id);
                return { id, fullName, email };
            } catch (err) {
                throw toTRPCError(err);
            }
        }),
    generateOTP: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/generateOTP"),
                tags: TAGS,
            },
        })
        .input(generateOTPInputModel)
        .output(generateOTPOutputModel)
        .mutation(async ({ input }) => {
            try {
                await userService.generateOTP({ email: input.email });
                return { success: true };
            } catch (err) {
                throw toTRPCError(err);
            }
        }),
    verifyOTP: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/verifyOTP"),
                tags: TAGS,
            },
        })
        .input(verifyOTPInputModel)
        .output(verifyOTPOutputModel)
        .mutation(async ({ input, ctx }) => {
            try {
                const { id, token } = await userService.verifyOTP({ email: input.email, code: input.code });
                ctx.setCookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                });
                return { id };
            } catch (err) {
                throw toTRPCError(err);
            }
        }),
    forgetPassword: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/forgetPassword"),
                tags: TAGS,
            },
        })
        .input(forgetPasswordInputModel)
        .output(forgetPasswordOutputModel)
        .mutation(async ({ input }) => {
            try {
                await userService.forgetPassword({ email: input.email });
                return { success: true };
            } catch (err) {
                throw toTRPCError(err);
            }
        }),
    resetPassword: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/resetPassword"),
                tags: TAGS,
            },
        })
        .input(resetPasswordInputModel)
        .output(resetPasswordOutputModel)
        .mutation(async ({ input }) => {
            try {
                await userService.resetPassword({ token: input.token, newPassword: input.newPassword });
                return { success: true };
            } catch (err) {
                throw toTRPCError(err);
            }
        }),
    logout: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/logout"),
                tags: TAGS,
            },
        })
        .input(logoutInputModel)
        .output(logoutOutputModel)
        .mutation(async ({ ctx }) => {
            ctx.setCookie("token", "", {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 0,
            });
            return { success: true };
        }),
});

