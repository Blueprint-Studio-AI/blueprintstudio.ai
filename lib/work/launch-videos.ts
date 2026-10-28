import type { WorkPageConfig } from "./types";

export const launchVideos: WorkPageConfig = {
  slug: "launch-videos",
  label: "Launch videos",
  // Placeholder: factual, but Tyler to write the real line.
  intro: "Product and launch videos for founders shipping something new.",
  introIsDraft: true,
  metaTitle: "Launch Video Portfolio",
  metaDescription: "Launch and product films by Blueprint Studio for TokenWorks, Perena, Piris Labs and Pyra.",
  order: ["tokenworks-agevisor-3", "perena-film", "piris-film", "pyra-film", "tokenworks-idvisor"],
};

/**
 * A film on the page's disc player: its full cut on YouTube, and either its
 * piece of work in data/portfolioData.ts (client, title, year, kit and links
 * come from there) or, for a film with no piece of its own, its details here.
 */
export interface LaunchFilm {
  /** The YouTube upload. Without one, the disc plays its kit's loop. */
  youtube?: string;
  /** Its piece of work, by slug. */
  work?: string;
  /** With no piece of work: a client slug from portfolioData, or a name (our own reel). */
  client?: string;
  title?: string;
  year?: string;
}

// The disc player's films, in rack order. Every upload is ours: on Blueprint
// Studio's YouTube channel, or (AgeVisor 3, Fake ID Detection) on the client's.
export const launchFilms: LaunchFilm[] = [
  { work: "tokenworks-agevisor-3", youtube: "PBJbbMQ17eo" },
  { work: "jinba-film", youtube: "aD9XnupXf_w" },
  { work: "perena-film", youtube: "DwqvawhROwE" },
  { work: "piris-film", youtube: "PeaWXlRNjPE" },
  { client: "logical", title: "YC F25 launch film", year: "2025", youtube: "W9gC1McdJMg" },
  { work: "pyra-film", youtube: "A1hq1u_M7L8" },
  { work: "tokenworks-fake-id", youtube: "XdmW5bcyiJU" },
  // Which IDScanner upload is our idVisor cut is still Tyler's call; until then it plays its kit loop.
  { work: "tokenworks-idvisor" },
  { client: "Blueprint Studio", title: "2025 show reel", year: "2025", youtube: "HRKKwThx-do" },
];
