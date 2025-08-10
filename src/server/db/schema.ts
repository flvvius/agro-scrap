// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `agro-scrap_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const offers = createTable(
  "offer",
  (d) => ({
    id: d.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    title: d.text("title").notNull(),
    cerealType: d.text("cereal_type").notNull(),
    price: d.numeric("price", { precision: 10, scale: 2 }).notNull(),
    quantity: d.text("quantity").notNull(),
    region: d.text("region").notNull(),
    contact: d.text("contact").notNull(),
    source: d.text("source").notNull(),
    url: d.text("url").notNull(),
    scrapedAt: d
      .timestamp("scraped_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("offer_cereal_type_idx").on(t.cerealType),
    index("offer_price_idx").on(t.price),
    index("offer_scraped_at_idx").on(t.scrapedAt),
    // Add unique constraint to prevent duplicates based on URL
    uniqueIndex("offer_url_unique_idx").on(t.url),
  ],
);
