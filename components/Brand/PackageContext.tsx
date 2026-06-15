"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

// Shared "build your package" state: the Add-ons cards (What's included
// section) and the Ready-to-launch pricing card both read and toggle the same
// selections, so adding an add-on anywhere updates the total everywhere.

export type AddonId = "website" | "pitchDeck";

export const BASE_PRICE = 18000;

export const ADDON_PRICES: Record<AddonId, number> = {
  website: 15000,
  pitchDeck: 5000,
};

export const formatUSD = (n: number) => "$" + n.toLocaleString("en-US");

interface PackageContextValue {
  selected: Record<AddonId, boolean>;
  toggleAddon: (id: AddonId) => void;
  total: number;
}

const PackageContext = createContext<PackageContextValue | null>(null);

export function PackageProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Record<AddonId, boolean>>({
    website: false,
    pitchDeck: false,
  });

  const toggleAddon = (id: AddonId) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const total = useMemo(
    () =>
      BASE_PRICE +
      (Object.keys(selected) as AddonId[]).reduce(
        (sum, id) => sum + (selected[id] ? ADDON_PRICES[id] : 0),
        0
      ),
    [selected]
  );

  return (
    <PackageContext.Provider value={{ selected, toggleAddon, total }}>
      {children}
    </PackageContext.Provider>
  );
}

export function usePackage() {
  const ctx = useContext(PackageContext);
  if (!ctx) throw new Error("usePackage must be used inside <PackageProvider>");
  return ctx;
}
