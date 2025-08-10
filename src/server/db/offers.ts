import { db } from "./index";
import { offers } from "./schema";
import { type OfferInput } from "~/lib/types";


export async function upsertOffers(items: OfferInput[]) {
  for (const item of items) {
    await db
      .insert(offers)
      .values({
        title: item.title,
        cerealType: item.cerealType,
        price: item.price.toString(),
        quantity: item.quantity,
        region: item.region,
        contact: item.contact,
        source: item.source,
        url: item.url,
        scrapedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: offers.url,
        set: {
          title: item.title,
          cerealType: item.cerealType,
          price: item.price.toString(),
          quantity: item.quantity,
          region: item.region,
          contact: item.contact,
          source: item.source,
          scrapedAt: new Date(),
        },
      });
  }
}
