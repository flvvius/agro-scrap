ALTER TABLE "agro-scrap_offer" ADD COLUMN "quantity" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agro-scrap_offer" ADD COLUMN "region" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agro-scrap_offer" ADD COLUMN "contact" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agro-scrap_offer" ADD COLUMN "source" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agro-scrap_offer" DROP COLUMN "raw_data";