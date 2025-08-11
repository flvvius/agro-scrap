import { api } from "~/trpc/react";
import Section from "./section";

export default function LatestSection() {
  const latest = api.offers.getLatest.useQuery(
    {
      limit: 10,
    },
    { suspense: true },
  );

  if (latest.error) {
    return <div>Eroare la incarcarea ofertelor!</div>;
  }

  return <Section offers={latest.data!} title="Ultimele oferte" />;
}
