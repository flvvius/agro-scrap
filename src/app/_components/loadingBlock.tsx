import { Loader } from "lucide-react";

export default function LoadingBlock({ text }: { text: string }) {
  return (
    <div className="flex h-40 items-center justify-center gap-3 rounded-lg bg-yellow-50 shadow">
      <Loader className="h-8 w-8 animate-spin text-yellow-700" />
      <span className="text-lg font-semibold text-yellow-800">{text}</span>
    </div>
  );
}
