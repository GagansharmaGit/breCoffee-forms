import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const otpsTable = pgTable("otps", {
    id: uuid("id").primaryKey().defaultRandom(),
    
    userId: uuid("user_id").references(() => usersTable.id).notNull(),
    code: varchar("code", { length: 6 }).notNull(),
    
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
