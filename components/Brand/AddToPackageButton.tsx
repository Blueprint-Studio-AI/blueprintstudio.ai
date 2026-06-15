"use client";

import { Check } from "lucide-react";
import { usePackage, type AddonId } from "./PackageContext";

// The shared secondary "+ Add to Package" button — used by the Add-ons cards
// (What's included section) and the Ready-to-launch pricing card, so the two
// always look and behave identically. Toggles the shared package selection.
export default function AddToPackageButton({
  id,
  className = "",
}: {
  id: AddonId;
  className?: string;
}) {
  const { selected, toggleAddon } = usePackage();
  const added = selected[id];

  return (
    <button
      type="button"
      onClick={() => toggleAddon(id)}
      className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border bg-white py-3 px-6 text-base font-medium transition-colors ${
        added
          ? "border-[#186FF5] text-[#186FF5]"
          : "border-neutral-200 text-black hover:border-neutral-300 hover:bg-neutral-50"
      } ${className}`}
    >
      {added && <Check className="h-4 w-4" strokeWidth={3} />}
      {added ? "Added to Package" : "+ Add to Package"}
    </button>
  );
}
