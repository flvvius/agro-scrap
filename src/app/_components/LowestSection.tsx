import { api } from "~/trpc/react";
import Section from "./section";

export default function LowestSection({ cerealType }: { cerealType: string }) {
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
