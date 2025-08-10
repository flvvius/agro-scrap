import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio";
import { upsertOffers } from "~/server/db/offers";
import { type OfferInput } from "~/lib/types";

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
  const listings = $("a.main_items.item_cart");
  console.log(
    `🔍 Found ${listings.length} listings, scraping individual pages...`,
  );

  // Process listings one by one to get detailed info
  for (let i = 0; i < listings.length; i++) {
    const el = listings[i];
    const $el = $(el);

    const title = $el.find(".title").text().trim();
    const priceRaw = $el.find(".price").text().trim();
    const price = parsePrice(priceRaw);

    // Location is in .location span
    const region =
      $el.find(".location").text().trim().replace(/.*\s/, "") || "";

    const cerealType = detectCerealType(title);

    // Only process if we have valid basic data
    if (!title || price <= 0) continue;

    // Get the product URL to scrape individual page
    let productUrl = $el.attr("href");
    if (!productUrl) continue;

    // Convert relative URLs to absolute URLs
    if (productUrl.startsWith("/")) {
      productUrl = `https://lajumate.ro${productUrl}`;
    } else if (!productUrl.startsWith("http")) {
      productUrl = `https://lajumate.ro/${productUrl}`;
    }

    try {
      console.log(
        `📄 Scraping ${i + 1}/${listings.length}: ${title.substring(0, 50)}...`,
      );
      console.log(`🔗 URL: ${productUrl}`);

      // Scrape individual product page
      const productResponse = await axios.get(productUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const productHtml = productResponse.data as string;
      const $product = cheerio.load(productHtml);

      // Extract quantity from description or details
      let quantity = "";
      const description = $product(".description, .details, .content").text();
      if (description) {
        // Look for quantity patterns like "1000 kg", "1 ton", etc.
        const quantityRegex = /(\d+(?:\.\d+)?)\s*(kg|ton|t|q|quintal)/i;
        const quantityMatch = quantityRegex.exec(description);
        if (quantityMatch) {
          quantity = `${quantityMatch[1]} ${quantityMatch[2]}`;
        }
      }

      // Extract contact information - be more specific to avoid labels
      let contact = "";

      // First try to find phone numbers in the text content
      const allText = $product("body").text();
      const phoneRegex = /(\+40|0)\s*\d{2,3}\s*\d{3}\s*\d{3}/g;
      const phoneMatches = allText.match(phoneRegex);
      if (phoneMatches && phoneMatches.length > 0) {
        contact = phoneMatches[0].trim();
      } else {
        // Try to find phone elements that contain actual numbers
        $product("*").each((_, el) => {
          const text = $product(el).text().trim();
          if (
            text &&
            /(\+40|0)\s*\d{2,3}\s*\d{3}\s*\d{3}/.test(text) &&
            !text.includes("Telefon") &&
            !text.includes("Phone") &&
            !contact // Only set if we haven't found one yet
          ) {
            contact = text;
          }
        });
      }

      // If no phone found, try to get seller name (avoid labels)
      if (!contact || contact === "Telefon" || contact === "Phone") {
        const sellerSelectors = [
          ".user-info .name",
          ".seller .name",
          ".author .name",
          ".profile .name",
          "[class*='user'] [class*='name']",
          "[class*='seller'] [class*='name']",
        ];

        for (const selector of sellerSelectors) {
          const sellerEl = $product(selector);
          if (sellerEl.length > 0) {
            const text = sellerEl.text().trim();
            // Only use if it's not a label
            if (
              text &&
              !text.includes("Telefon") &&
              !text.includes("Phone") &&
              !text.includes("Nume") &&
              !text.includes("Name")
            ) {
              contact = text;
              break;
            }
          }
        }
      }

      // Clean up contact info
      if (
        contact &&
        (contact === "Telefon" ||
          contact === "Phone" ||
          contact.includes("Telefon") ||
          contact.includes("Phone"))
      ) {
        contact = "-";
      }

      items.push({
        title,
        cerealType,
        price,
        quantity: quantity || "-",
        region,
        contact: contact || "-",
        source: "lajumate",
        url: productUrl,
      });

      // Add a small delay to be respectful to the server
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`⚠️  Failed to scrape individual page for: ${title}`);
      // Still add the item with basic info
      items.push({
        title,
        cerealType,
        price,
        quantity: "-",
        region,
        contact: "-",
        source: "lajumate",
        url: productUrl,
      });
    }
  }

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
