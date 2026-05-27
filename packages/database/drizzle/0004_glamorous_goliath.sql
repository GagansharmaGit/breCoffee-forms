CREATE TYPE "public"."form_status_enum" AS ENUM('PUBLISHED', 'DRAFT');--> statement-breakpoint
CREATE TYPE "public"."form_visibility_enum" AS ENUM('PUBLIC', 'UNLISTED');--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'LONG_TEXT' BEFORE 'EMAIL';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'CHECKBOX';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'DROPDOWN';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'RATING';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'DATE';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'MULTI_SELECT';--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "visibility" "form_visibility_enum" DEFAULT 'PUBLIC' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "status" "form_status_enum" DEFAULT 'DRAFT' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "theme" varchar(50) DEFAULT 'coffee' NOT NULL;