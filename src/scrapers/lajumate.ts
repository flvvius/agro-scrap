import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio";
import { upsertOffers, type OfferInput } from "../server/db/offers";

const LISTING_URL = "https://lajumate.ro/cauta_cereale.html";
// “Cereale” category

/**
 * Turn “1.200,50 lei” → 1200.50
 */
function parsePrice(raw: string): number {
  const cleaned = raw
    .replace(/[^\d.,]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return parseFloat(cleaned) || 0;
}

/**
 * Simple keyword matching on the title
 */
function detectCerealType(title: string): string {
  const t = title.toLowerCase();
  if (/(grau|grâ?u|wheat)/.test(t)) return "wheat";
  if (/(porumb|corn)/.test(t)) return "corn";
  if (/(orz|barley)/.test(t)) return "barley";
  return "other";
}

async function scrapeLajumate() {
  console.log("⏳ Fetching listings…");
  const response = await axios.get(LISTING_URL, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = response.data as string;
  const $ = cheerio.load(html);

  const items: OfferInput[] = [];

  // Each listing is an anchor with class "main_items item_cart"
  $("a.main_items.item_cart").each((_, el) => {
    const $el = $(el);

    const title = $el.find(".title").text().trim();
    const priceRaw = $el.find(".price").text().trim();
    const price = parsePrice(priceRaw);

    // Location is in .location span
    const region =
      $el.find(".location").text().trim().replace(/.*\s/, "") || "";

    // For now, set quantity as empty since it's not visible in the listing
    const quantity = "";

    // Contact info might need individual page scraping
    const contact = "";

    const cerealType = detectCerealType(title);

    // Only add if we have valid data
    if (title && price > 0) {
      items.push({
        title,
        cerealType,
        price,
        quantity,
        region,
        contact,
        source: "lajumate",
      });
    }
  });

  console.log(`📝 Parsed ${items.length} items`);

  if (items.length === 0) {
    console.log("⚠️  No items found. Website structure might have changed.");
    console.log("🔍 Debug: HTML length:", html.length);
    console.log(
      "🔍 Debug: Found a.main_items.item_cart elements:",
      $("a.main_items.item_cart").length,
    );

    // Save HTML for inspection
    const fs = await import("fs");
    await fs.promises.writeFile("debug_lajumate.html", html);
    console.log("💾 Saved HTML to debug_lajumate.html for inspection");
    return;
  }

  console.log("💾 Upserting to database...");
  await upsertOffers(items);
  console.log("✅ Done");
}

scrapeLajumate().catch((err) => {
  console.error("❌ Scrape failed:", err);
  process.exit(1);
});
