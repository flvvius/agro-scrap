export const translateCereal = (type: string) => {
  switch (type) {
    case "wheat":
      return "Grâu";
    case "corn":
      return "Porumb";
    case "barley":
      return "Orz";
    default:
      return type;
  }
};

export type OfferInput = {
  title: string;
  cerealType: string;
  price: number;
  quantity: string;
  region: string;
  contact: string;
  source: string;
  url: string;
};

export type Offer = {
  id: number;
  title: string;
  cerealType: string;
  price: string;
  quantity: string;
  region: string;
  contact: string;
  source: string;
  url: string;
  scrapedAt: Date;
};
