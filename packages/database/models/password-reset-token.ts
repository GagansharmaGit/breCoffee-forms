import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const passwordResetTokensTable = pgTable("password_reset_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    
    userId: uuid("user_id").references(() => usersTable.id).notNull(),
    token: varchar("token", { length: 64 }).notNull(),
    
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
