import { db } from "./index";
import { offers } from "./schema";

export type OfferInput = {
  title: string;
  cerealType: string;
  price: number;
  quantity: string;
  region: string;
  contact: string;
  source: string;
};

export async function upsertOffers(items: OfferInput[]) {
  await db.insert(offers).values(
    items.map((o) => ({
      title: o.title,
      cerealType: o.cerealType,
      price: o.price.toString(),
      quantity: o.quantity,
      region: o.region,
      contact: o.contact,
      source: o.source,
      scrapedAt: new Date(),
    })),
  );
}
