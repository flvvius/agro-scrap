"use client";

import { Card, CardTitle, CardHeader, CardContent } from "~/components/ui/card";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "~/components/ui/select";
import { Wheat, Sprout } from "lucide-react";
import { useCerealStore } from "../store/cerealStore";

function CornIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 2C24 10 20 20 20 32s4 22 12 30c8-8 12-18 12-30S40 10 32 2z"
        fill="#FFD54F"
        stroke="#FBC02D"
        strokeWidth="2"
      />
      <path
        d="M20 32c-6 4-10 10-10 18s4 14 10 18c6-4 10-10 10-18S26 36 20 32zM44 32c6 4 10 10 10 18s-4 14-10 18c-6-4-10-10-10-18s4-14 10-18z"
        fill="#81C784"
        stroke="#388E3C"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function CerealSelection() {
  const { cerealType, setCerealType } = useCerealStore();
  return (
    <Card className="rounded-xl border-4 border-yellow-400 bg-gradient-to-b from-yellow-100 to-yellow-50 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-2xl font-extrabold text-yellow-900">
          Alege tipul de cereală
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={cerealType} onValueChange={setCerealType}>
          <SelectTrigger className="h-14 rounded-lg border-2 border-yellow-500 bg-white text-xl font-semibold focus:ring-4 focus:ring-yellow-400">
            <SelectValue placeholder="Alege cereală" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-2 border-yellow-300 bg-white shadow-xl">
            <SelectItem
              value="wheat"
              className="flex cursor-pointer items-center gap-3 px-2 py-4 text-lg font-bold hover:bg-yellow-100"
            >
              <Wheat className="h-6 w-6 text-yellow-800" /> Grâu
            </SelectItem>
            <SelectItem
              value="corn"
              className="flex cursor-pointer items-center gap-3 px-2 py-4 text-lg font-bold hover:bg-yellow-100"
            >
              <CornIcon className="h-6 w-6" /> Porumb
            </SelectItem>
            <SelectItem
              value="barley"
              className="flex cursor-pointer items-center gap-3 px-2 py-4 text-lg font-bold hover:bg-yellow-100"
            >
              <Sprout className="h-6 w-6 text-green-700" /> Orz
            </SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
