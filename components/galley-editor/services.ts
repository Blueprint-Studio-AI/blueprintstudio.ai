"use client";

import { createContext, useContext } from "react";
import type { EditorActions, ManifestComponent } from "./types";

/** What node views need from the editor around them. */
export interface Services {
  slug: string;
  actions: EditorActions;
  components: ManifestComponent[];
  /** Open the library to choose an image for this block. */
  pickImage(pos: number): void;
  /** Open the generator to make options for this block, in its place in the post. */
  generateFor(pos: number): void;
}

export const ServicesContext = createContext<Services | null>(null);

export function useServices(): Services {
  const services = useContext(ServicesContext);
  if (!services) throw new Error("Galley editor services missing");
  return services;
}
