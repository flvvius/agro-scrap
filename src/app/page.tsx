"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Loader } from "lucide-react";
import Section from "./_components/section";
import CerealSelection from "./_components/cerealSelection";

export default function Home() {
  const [cerealType, setCerealType] = useState("wheat");
  const latest = api.offers.getLatest.useQuery({ limit: 10 });
  const lowest = api.offers.getLowest.useQuery({
    cerealType,
    limit: 10,
  });

  if (latest.isLoading || lowest.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-yellow-50">
        <Loader className="h-12 w-12 animate-spin text-yellow-700" />
      </div>
    );
  }

  if (latest.error || lowest.error || !lowest.data || !latest.data) {
    return (
      <div className="flex h-screen items-center justify-center bg-yellow-50">
        <p className="rounded-lg bg-red-100 px-6 py-4 text-2xl font-bold text-red-700 shadow">
          Eroare la încărcarea ofertelor.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-50 px-4 py-6">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <h1 className="rounded-lg bg-yellow-200 px-4 py-3 text-center text-4xl font-extrabold text-yellow-900 shadow">
          Panou Prețuri Cereale
        </h1>

        <CerealSelection
          cerealType={cerealType}
          setCerealType={setCerealType}
        />

        <Section offers={lowest.data} title="💰 Cele mai mici prețuri" />

        <Section offers={latest.data} title="🆕 Oferte recente" />
      </div>
    </div>
  );
}
