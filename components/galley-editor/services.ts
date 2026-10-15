"use client";

import { createContext, useContext } from "react";
import type { Uploaded } from "./chooser";
import type { EditorActions, LibraryAsset, ManifestComponent } from "./types";

/** What blocks need from the editor around them. */
export interface Services {
  slug: string;
  actions: EditorActions;
  components: ManifestComponent[];
  /** Use a library or generated picture for the image block at `pos`. */
  chooseImage(pos: number, asset: LibraryAsset): Promise<void>;
  /** Use an uploaded file for the image block at `pos`. */
  setImage(pos: number, file: Uploaded): void;
  /** A prompt for an image at `pos`, from the passage around it. */
  contextFor(pos: number | null): string;
  /** Show a panel on the block at `pos` (its form, image chooser or options), or none. */
  setUi(pos: number, ui: "edit" | "replace" | "options" | null): void;
}

export const ServicesContext = createContext<Services | null>(null);

export function useServices(): Services {
  const services = useContext(ServicesContext);
  if (!services) throw new Error("Galley editor services missing");
  return services;
}
