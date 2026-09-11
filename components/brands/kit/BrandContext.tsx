"use client";

// Supplies the active BrandConfig to every kit component, so none of them import
// a specific brand's data. Client components read it with useBrand(); the page
// wraps the tree in <BrandProvider brand={...}>.
import { createContext, useContext } from "react";
import type { BrandConfig } from "@/components/brands/kit/types";

const BrandCtx = createContext<BrandConfig | null>(null);

export function BrandProvider({ brand, children }: { brand: BrandConfig; children: React.ReactNode }) {
  return <BrandCtx.Provider value={brand}>{children}</BrandCtx.Provider>;
}

export function useBrand(): BrandConfig {
  const brand = useContext(BrandCtx);
  if (!brand) throw new Error("useBrand must be used inside <BrandProvider>");
  return brand;
}
