import { Suspense } from "react";
import CerealSelection from "./_components/cerealSelection";
import LoadingBlock from "./_components/loadingBlock";
import LowestSection from "./_components/LowestSection";
import LatestSection from "./_components/LatestSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-50 px-4 py-6">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <h1 className="rounded-lg bg-yellow-200 px-4 py-3 text-center text-4xl font-extrabold text-yellow-900 shadow">
          Panou Prețuri Cereale
        </h1>

        <CerealSelection />

        <Suspense
          fallback={<LoadingBlock text="Se încarcă cele mai mici prețuri" />}
        >
          <LowestSection />
        </Suspense>

        <Suspense fallback={<LoadingBlock text="Se încarcă ultimele oferte" />}>
          <LatestSection />
        </Suspense>
      </div>
    </div>
  );
}
