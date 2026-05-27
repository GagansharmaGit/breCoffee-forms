import { z } from "zod";

export const createUserWithEmailAndPassword = z.object({
    fullName: z.string().describe("Full name of the user"),
    email: z.email().describe("Email of the user"),
    password: z.string().describe("Password of the user"),
});

export type CreateUserWithEmailAndPasswordType = z.infer<typeof createUserWithEmailAndPassword>;

export const generateUserTokenPayload = z.object({
    id: z.string().describe("ID of the user"),
});

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>;

export const signInUserWithEmailAndPassword = z.object({
    email: z.email().describe("Email of the user"),
    password: z.string().describe("Password of the user"),
});

export type SignInUserWithEmailAndPasswordType = z.infer<typeof signInUserWithEmailAndPassword>;

export const generateOTPModel = z.object({
    email: z.email().describe("Email of the user"),
});
export type GenerateOTPType = z.infer<typeof generateOTPModel>;

export const verifyOTPModel = z.object({
    email: z.email().describe("Email of the user"),
    code: z.string().length(6).describe("6-digit OTP code"),
});
export type VerifyOTPType = z.infer<typeof verifyOTPModel>;

export const forgetPasswordModel = z.object({
    email: z.email().describe("Email of the user"),
});
export type ForgetPasswordType = z.infer<typeof forgetPasswordModel>;

export const resetPasswordModel = z.object({
    token: z.string().describe("Password reset token"),
    newPassword: z.string().describe("New password of the user"),
});
export type ResetPasswordType = z.infer<typeof resetPasswordModel>;
