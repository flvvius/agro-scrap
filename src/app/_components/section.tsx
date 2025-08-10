import type { Offer } from "~/lib/types";
import OfferCard from "./offer";

type SectionProps = {
  offers: Offer[];
  title: string;
};

export default function Section({ offers, title }: SectionProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 rounded-lg bg-yellow-200 px-4 py-2 text-3xl font-extrabold text-yellow-900 shadow">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {offers.map((o) => (
          <OfferCard key={o.id} o={o} />
        ))}
      </div>
    </section>
  );
}
