"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Loader } from "lucide-react";
export default function Home() {
  const [cerealType, setCerealType] = useState("wheat");
  const latest = api.offers.getLatest.useQuery({ limit: 10 });
  const lowest = api.offers.getLowest.useQuery({
    cerealType,
    limit: 10,
  });

  if (latest.isLoading || lowest.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-10 w-10 animate-spin" />
      </div>
    );
  }
  if (latest.error || lowest.error || !lowest.data || !latest.data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-red-600">Error loading offers.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto w-full max-w-lg space-y-6">
        <h1 className="text-center text-3xl font-bold">
          Cereal Price Dashboard
        </h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Cereal</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={cerealType} onValueChange={setCerealType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose cereal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="corn">Corn</SelectItem>
                <SelectItem value="barley">Barley</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <section>
          <h2 className="mb-2 text-2xl font-semibold">Lowest Prices</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lowest.data.map((o) => (
              <Card key={o.id} className="bg-white">
                <CardHeader>
                  <CardTitle className="text-xl">{o.price} lei/kg</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  {o.region} • {o.contact}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-semibold">Latest Offers</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {latest.data.map((o) => (
              <Card key={o.id} className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base">
                    {new Date(o.scrapedAt).toLocaleDateString()}{" "}
                    {new Date(o.scrapedAt).toLocaleTimeString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  {o.cerealType} • {o.price} lei/kg • {o.region}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
