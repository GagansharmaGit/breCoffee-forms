import { db, eq } from "./index";
import { usersTable } from "./models/user";
import { formsTable } from "./models/form";
import { formFieldsTable } from "./models/form-field";
import { formSubmissionsTable } from "./models/form-submission";
import { randomUUID } from "crypto";

async function main() {
    console.log("Seeding database...");

    try {
        // 1. Create a dummy user
        console.log("Creating dummy user...");
        let user;
        const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, "demo@brewcoffee.com"));
        
        if (existingUsers.length > 0) {
            user = existingUsers[0];
            console.log("User already exists, using existing user.");
        } else {
            const [newUser] = await db.insert(usersTable).values({
                fullName: "Demo User",
                email: "demo@brewcoffee.com",
                passwordHash: "hashedpassword123", // Mock password
            }).returning();
            user = newUser;
        }
        
        if (!user) {
            throw new Error("Failed to create user");
        }

        // 2. Create Forms
        console.log("Creating themed forms...");
        
        // Form 1: Coffee Theme
        const [form1] = await db.insert(formsTable).values({
            title: "Coffee Shop Feedback",
            description: "Help us improve our new roast and cafe experience.",
            visibility: "PUBLIC",
            status: "PUBLISHED",
            theme: "coffee",
            createdBy: user.id,
        }).returning();

        // Form 2: Dark Theme
        const [form2] = await db.insert(formsTable).values({
            title: "Developer Survey 2026",
            description: "Share your thoughts on the latest tools and frameworks.",
            visibility: "PUBLIC",
            status: "PUBLISHED",
            theme: "dark",
            createdBy: user.id,
        }).returning();

        // Form 3: Modern Theme
        const [form3] = await db.insert(formsTable).values({
            title: "Event Registration",
            description: "RSVP for our upcoming design conference.",
            visibility: "PUBLIC",
            status: "PUBLISHED",
            theme: "modern",
            createdBy: user.id,
        }).returning();

        if (!form1 || !form2 || !form3) throw new Error("Failed to create forms");

        // 3. Add Fields to Form 1 (Coffee)
        console.log("Adding fields to forms...");
        const [f1q1] = await db.insert(formFieldsTable).values({
            formId: form1.id,
            label: "How would you rate our new Espresso blend?",
            labelKey: "rating_espresso",
            type: "RATING",
            isRequired: true,
            index: "0",
        }).returning();

        const [f1q2] = await db.insert(formFieldsTable).values({
            formId: form1.id,
            label: "What is your favorite pastry?",
            labelKey: "favorite_pastry",
            type: "DROPDOWN",
            description: "Select one from the menu",
            isRequired: false,
            index: "1",
        }).returning();

        // Add Fields to Form 2 (Dark)
        const [f2q1] = await db.insert(formFieldsTable).values({
            formId: form2.id,
            label: "Which framework do you use the most?",
            labelKey: "primary_framework",
            type: "TEXT",
            isRequired: true,
            index: "0",
        }).returning();

        const [f2q2] = await db.insert(formFieldsTable).values({
            formId: form2.id,
            label: "Do you prefer spaces over tabs?",
            labelKey: "spaces_tabs",
            type: "YES_NO",
            isRequired: true,
            index: "1",
        }).returning();

        // Add Fields to Form 3 (Modern)
        const [f3q1] = await db.insert(formFieldsTable).values({
            formId: form3.id,
            label: "Your Email Address",
            labelKey: "email_address",
            type: "EMAIL",
            isRequired: true,
            index: "0",
        }).returning();

        const [f3q2] = await db.insert(formFieldsTable).values({
            formId: form3.id,
            label: "Dietary Restrictions",
            labelKey: "dietary",
            type: "MULTI_SELECT",
            isRequired: false,
            index: "1",
        }).returning();
        
        if (!f1q1 || !f1q2 || !f2q1 || !f2q2 || !f3q1 || !f3q2) {
            throw new Error("Failed to create fields");
        }

        // 4. Create Submissions
        console.log("Adding mock submissions...");
        
        // Submissions for Form 1
        await db.insert(formSubmissionsTable).values([
            {
                formId: form1.id,
                values: [
                    { fieldId: f1q1.id, value: "5" },
                    { fieldId: f1q2.id, value: "Croissant" }
                ]
            },
            {
                formId: form1.id,
                values: [
                    { fieldId: f1q1.id, value: "4" },
                    { fieldId: f1q2.id, value: "Muffin" }
                ]
            }
        ]);

        // Submissions for Form 2
        await db.insert(formSubmissionsTable).values([
            {
                formId: form2.id,
                values: [
                    { fieldId: f2q1.id, value: "Next.js" },
                    { fieldId: f2q2.id, value: "Yes" }
                ]
            },
            {
                formId: form2.id,
                values: [
                    { fieldId: f2q1.id, value: "Svelte" },
                    { fieldId: f2q2.id, value: "No" }
                ]
            }
        ]);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

main();
