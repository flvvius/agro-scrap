import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { offers } from "~/server/db/schema";
import { eq, asc, desc } from "drizzle-orm";

export const offersRouter = createTRPCRouter({
  getLowest: publicProcedure
    .input(z.object({ cerealType: z.string(), limit: z.number().default(10) }))
    .query(({ input }) =>
      db
        .select()
        .from(offers)
        .where(eq(offers.cerealType, input.cerealType))
        .orderBy(asc(offers.price))
        .limit(input.limit),
    ),

  getLatest: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(({ input }) =>
      db
        .select()
        .from(offers)
        .orderBy(desc(offers.scrapedAt))
        .limit(input.limit),
    ),
});
