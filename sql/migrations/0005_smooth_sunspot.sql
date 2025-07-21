CREATE TABLE "branch_manager" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid,
	"store_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "manager_store_assignments" CASCADE;--> statement-breakpoint
ALTER TABLE "branch_manager" ADD CONSTRAINT "branch_manager_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_manager" ADD CONSTRAINT "branch_manager_store_id_stores_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("store_id") ON DELETE cascade ON UPDATE no action;