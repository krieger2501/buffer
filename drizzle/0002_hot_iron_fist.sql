CREATE TABLE "user_settings" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"display_name" text,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"week_start_day" text DEFAULT 'monday' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
