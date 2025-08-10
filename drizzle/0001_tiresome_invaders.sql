ALTER TABLE "agro-scrap_offer" ADD COLUMN "raw_data" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "agro-scrap_offer" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "agro-scrap_offer" DROP COLUMN "quantity";--> statement-breakpoint
ALTER TABLE "agro-scrap_offer" DROP COLUMN "region";--> statement-breakpoint
ALTER TABLE "agro-scrap_offer" DROP COLUMN "contact";--> statement-breakpoint
ALTER TABLE "agro-scrap_offer" DROP COLUMN "source";