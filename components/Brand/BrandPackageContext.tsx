"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface BrandPackageState {
  websiteAdded: boolean;
  deckAdded: boolean;
  toggleWebsite: () => void;
  toggleDeck: () => void;
  total: number;
}

const BASE_PRICE = 18000;
const WEBSITE_PRICE = 15000;
const DECK_PRICE = 5000;

const BrandPackageContext = createContext<BrandPackageState | null>(null);

export function BrandPackageProvider({ children }: { children: ReactNode }) {
  const [websiteAdded, setWebsiteAdded] = useState(false);
  const [deckAdded, setDeckAdded] = useState(false);

  const total =
    BASE_PRICE +
    (websiteAdded ? WEBSITE_PRICE : 0) +
    (deckAdded ? DECK_PRICE : 0);

  return (
    <BrandPackageContext.Provider
      value={{
        websiteAdded,
        deckAdded,
        toggleWebsite: () => setWebsiteAdded((prev) => !prev),
        toggleDeck: () => setDeckAdded((prev) => !prev),
        total,
      }}
    >
      {children}
    </BrandPackageContext.Provider>
  );
}

export function useBrandPackage() {
  const context = useContext(BrandPackageContext);
  if (!context) {
    throw new Error(
      "useBrandPackage must be used within a BrandPackageProvider"
    );
  }
  return context;
}

export { BASE_PRICE, WEBSITE_PRICE, DECK_PRICE };
