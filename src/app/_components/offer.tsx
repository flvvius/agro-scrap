import {
  Calendar,
  LinkIcon,
  MapPin,
  Package,
  Phone,
  Tag,
  Wheat,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { translateCereal, type Offer } from "~/lib/types";

export default function Offer({ o }: { o: Offer }) {
  const {
    id,
    title,
    cerealType,
    price,
    quantity,
    region,
    contact,
    source,
    scrapedAt,
    url,
  } = o;

  const getPriceColor = (price: string) => {
    const p = parseFloat(price);
    if (isNaN(p)) return "text-gray-800";
    if (p <= 1.2) return "text-green-700 font-extrabold"; // ieftin
    if (p <= 1.5) return "text-orange-600 font-extrabold"; // mediu
    return "text-red-700 font-extrabold"; // scump
  };

  return (
    <Card
      key={id}
      className="rounded-xl border-2 border-yellow-300 bg-gradient-to-b from-yellow-50 to-white shadow-lg"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-yellow-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-lg">
        <div className="flex items-center gap-3">
          <Wheat className="h-6 w-6 text-green-700" />
          <span className="font-semibold">Cereală:</span>{" "}
          {translateCereal(cerealType)}
        </div>
        <div className="flex items-center gap-3">
          <Tag className="h-6 w-6 text-yellow-600" />
          <span className="font-semibold">Preț:</span>{" "}
          <span className={getPriceColor(price)}>{price} lei/kg</span>
        </div>
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-blue-600" />
          <span className="font-semibold">Cantitate:</span> {quantity}
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-red-600" />
          <span className="font-semibold">Regiune:</span> {region}
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-6 w-6 text-purple-600" />
          <span className="font-semibold">Contact:</span>{" "}
          {contact !== "-" ? (
            <a
              href={`tel:${contact}`}
              className="text-blue-700 underline hover:text-blue-900"
            >
              {contact}
            </a>
          ) : (
            "-"
          )}
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-orange-600" />
          <span className="font-semibold">Data preluării:</span>{" "}
          {new Date(scrapedAt).toLocaleString("ro-RO")}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 pt-2 font-semibold text-blue-700 underline hover:text-blue-900"
        >
          <LinkIcon className="h-5 w-5 text-gray-700" />
          Vezi pe {source} →
        </a>
      </CardContent>
    </Card>
  );
}
