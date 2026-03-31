DELETE FROM "joke_votes";--> statement-breakpoint
ALTER TABLE "joke_votes" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "joke_votes" ADD CONSTRAINT "joke_votes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "joke_votes_joke_user_uidx" ON "joke_votes" USING btree ("joke_id","user_id");