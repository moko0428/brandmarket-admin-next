CREATE TABLE "manager_store_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"manager_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "is_banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "manager_store_assignments" ADD CONSTRAINT "manager_store_assignments_manager_id_profiles_profile_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_store_assignments" ADD CONSTRAINT "manager_store_assignments_store_id_stores_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("store_id") ON DELETE cascade ON UPDATE no action;