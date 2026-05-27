import { z } from "zod";

const envSchema = z.object({
    JWT_SECRET: z.string().describe("Secret key for JWT tokens"),
    RESEND_API_KEY: z.string().optional(),
    ENABLE_OTP_LOGIN: z.string().default("false").transform((val) => val === "true"),
    WEB_URL: z.string().url().default("http://localhost:3000"),
});

function createEnv(env: NodeJS.ProcessEnv) {
    const safeParseResult = envSchema.safeParse(env);
    if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
    return safeParseResult.data;
}

export const env = createEnv(process.env);
