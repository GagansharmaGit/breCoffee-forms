import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import { otpsTable } from "@repo/database/models/otp";
import { passwordResetTokensTable } from "@repo/database/models/password-reset-token";

import bcrypt from "bcryptjs";
import * as JWT from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";

import { env } from "../env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

import {
    createUserWithEmailAndPassword,
    type CreateUserWithEmailAndPasswordType,
    generateUserTokenPayload,
    type GenerateUserTokenPayloadType,
    signInUserWithEmailAndPassword,
    type SignInUserWithEmailAndPasswordType,
    generateOTPModel,
    type GenerateOTPType,
    verifyOTPModel,
    type VerifyOTPType,
    forgetPasswordModel,
    type ForgetPasswordType,
    resetPasswordModel,
    type ResetPasswordType,
} from "./model";

export default class UserService {
    private async getUserByEmail(email: string) {
        const result = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (!result || result.length === 0) return null;

        return result[0];
    }

    private async generateUserToken(payload: GenerateUserTokenPayloadType) {
        const { id } = await generateUserTokenPayload.parseAsync(payload);

        const token = JWT.sign({ id }, env.JWT_SECRET);

        return { token };
    }

    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordType) {
        const { fullName, email, password } =
            await createUserWithEmailAndPassword.parseAsync(payload);

        const existingUser = await this.getUserByEmail(email);
        if (existingUser) throw new Error("User with this email already exists");

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await db
            .insert(usersTable)
            .values({ fullName, email, passwordHash })
            .returning({ id: usersTable.id });

        if (!result || result.length === 0 || !result[0]?.id) {
            throw new Error("Something went wrong while creating a new user");
        }

        const { token } = await this.generateUserToken({ id: result[0].id });

        return {
            id: result[0].id,
            token,
        };
    }

    public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordType) {
        const { email, password } = await signInUserWithEmailAndPassword.parseAsync(payload);

        const existingUser = await this.getUserByEmail(email);
        if (!existingUser) {
            throw new Error("User with this email does not exist");
        }

        if (!existingUser.passwordHash) {
            throw new Error("Invalid authentication method");
        }

        const isValid = await bcrypt.compare(password, existingUser.passwordHash);
        if (!isValid) throw new Error("Invalid email address or password");

        const { token } = await this.generateUserToken({ id: existingUser.id });

        return {
            id: existingUser.id,
            token,
        };
    }

    public async getUserInfoById(id: string) {
        const user = await db
            .select({ id: usersTable.id, fullName: usersTable.fullName, email: usersTable.email })
            .from(usersTable)
            .where(eq(usersTable.id, id));

        if (!user || user.length === 0) throw new Error("User with this ID does not exist");

        return user[0]!;
    }

    public async verifyAndDecodeUserToken(token: string) {
        try {
            const result = JWT.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType;

            return result;
        } catch (err) {
            throw new Error("Invalid token");
        }
    }

    public async generateOTP(payload: GenerateOTPType) {
        const { email } = await generateOTPModel.parseAsync(payload);
        const user = await this.getUserByEmail(email);
        if (!user) throw new Error("User with this email does not exist");

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await db.insert(otpsTable).values({
            userId: user.id,
            code,
            expiresAt,
        });

        if (resend) {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: email,
                subject: "Your OTP Code",
                html: `<p>Your OTP code is: <strong>${code}</strong></p>`,
            });
        } else {
            console.log(`\n\n[MOCK EMAIL] OTP for ${email} is: ${code}\n\n`);
        }

        return { success: true };
    }

    public async verifyOTP(payload: VerifyOTPType) {
        const { email, code } = await verifyOTPModel.parseAsync(payload);
        const user = await this.getUserByEmail(email);
        if (!user) throw new Error("User with this email does not exist");

        const otpRecord = await db.select().from(otpsTable).where(eq(otpsTable.userId, user.id));
        const latestOTP = otpRecord.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())[0];

        if (!latestOTP || latestOTP.code !== code) {
            throw new Error("Invalid OTP");
        }

        if (latestOTP.expiresAt < new Date()) {
            throw new Error("OTP has expired");
        }

        const { token } = await this.generateUserToken({ id: user.id });

        return { id: user.id, token };
    }

    public async forgetPassword(payload: ForgetPasswordType) {
        const { email } = await forgetPasswordModel.parseAsync(payload);
        const user = await this.getUserByEmail(email);
        if (!user) throw new Error("User with this email does not exist");

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await db.insert(passwordResetTokensTable).values({
            userId: user.id,
            token,
            expiresAt,
        });

        const resetLink = `${env.WEB_URL}/reset-password?token=${token}`;
        if (resend) {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: email,
                subject: "Reset your password",
                html: `<p>Click here to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
            });
        } else {
            console.log(`\n\n[MOCK EMAIL] Password Reset Link for ${email}: ${resetLink}\n\n`);
        }

        return { success: true };
    }

    public async resetPassword(payload: ResetPasswordType) {
        const { token, newPassword } = await resetPasswordModel.parseAsync(payload);

        const resetRecord = await db.select().from(passwordResetTokensTable).where(eq(passwordResetTokensTable.token, token));
        const record = resetRecord[0];
        if (!record) throw new Error("Invalid reset token");
        if (record.expiresAt < new Date()) throw new Error("Reset token has expired");

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, record.userId));

        return { success: true };
    }
}
