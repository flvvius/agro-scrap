import { api } from "~/trpc/server";
import Section from "./section";

export default async function LatestSection() {
  const latest = await api.offers.getLatest({
    limit: 10,
  });

  return <Section offers={latest} title="Ultimele oferte" />;
}
