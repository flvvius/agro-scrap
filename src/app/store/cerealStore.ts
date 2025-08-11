import { create } from "zustand";
import { persist } from "zustand/middleware";

type CerealState = {
  cerealType: string;
  setCerealType: (type: string) => void;
};

export const useCerealStore = create<CerealState>()(
  persist(
    (set) => ({
      cerealType: "wheat",
      setCerealType: (type) => set({ cerealType: type }),
    }),
    { name: "cereal-storage" }, // key in localStorage
  ),
);
