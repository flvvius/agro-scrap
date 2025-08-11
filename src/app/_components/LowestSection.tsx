"use client";

import { api } from "~/trpc/react";
import Section from "./section";
import { useCerealStore } from "../store/cerealStore";

export default function LowestSection() {
  const { cerealType } = useCerealStore();
  const lowest = api.offers.getLowest.useQuery(
    {
      cerealType,
      limit: 10,
    },
    { suspense: true },
  );

  if (lowest.error) {
    return <div>Eroare la incarcarea ofertelor!</div>;
  }

  return <Section offers={lowest.data!} title="Cele mai mici prețuri" />;
}
