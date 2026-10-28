import { clients } from "@/data/portfolioData";
import { clientBySlug, clientPath, hasClientPage, isShown, workShowcase, type ShowcaseLink } from "@/lib/work";
import { launchFilms } from "@/lib/work/launch-videos";
import Draft from "../Draft";
import type { GalleryProps } from "./index";
import DiscGallery from "./launch-videos/DiscGallery";
import type { Film } from "./launch-videos/shared";

// /work/launch-videos opens on a disc player: each film a jewel case, played
// on a big screen once its disc is in (launch-videos/DiscGallery). This side
// runs on the server, so only what the player needs goes to the browser.

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

/** The films in lib/work/launch-videos.ts, resolved against the data: public work only. */
function resolveFilms(works: GalleryProps["works"]): Film[] {
  return launchFilms.flatMap((f): Film[] => {
    if (f.work) {
      const client = clients.find((c) => c.work.some((w) => w.slug === f.work));
      const work = client?.work.find((w) => w.slug === f.work);
      if (!client || !work || work.visibility !== "public" || !(isShown(client) || work.showWhenArchived)) return [];
      if (!work.kit && !f.youtube) return [];
      const alt = `${work.title}, ${client.name}`;
      const piece = works.find((w) => w.slug === work.slug);
      const { vertical: _phone, ...hero } = work.kit?.hero ?? { poster: "", alt };
      const links: ShowcaseLink[] = piece
        ? workShowcase(piece).links
        : hasClientPage(client)
          ? [{ label: `All ${client.name} work`, href: clientPath(client) }]
          : [];
      return [
        {
          slug: work.slug,
          title: work.title,
          client: client.name,
          year: work.year,
          youtube: f.youtube,
          cover: work.kit ? work.kit.stills[0] : { src: thumb(f.youtube!), alt, remote: true },
          hero: work.kit ? hero : { poster: thumb(f.youtube!), alt, remote: true },
          piece: piece?.slug,
          links,
        },
      ];
    }
    // A film with no piece of work of its own: a client of ours from the data, or our own reel.
    if (!f.youtube || !f.title) return [];
    const client = f.client ? clientBySlug(f.client) : undefined;
    if (client && !isShown(client)) return [];
    const name = client?.name ?? f.client ?? "Blueprint Studio";
    const alt = `${f.title}, ${name}`;
    return [
      {
        slug: `yt-${f.youtube}`,
        title: f.title,
        client: name,
        year: f.year ?? "",
        youtube: f.youtube,
        cover: { src: thumb(f.youtube), alt, remote: true },
        hero: { poster: thumb(f.youtube), alt, remote: true },
        links: client && hasClientPage(client) ? [{ label: `All ${name} work`, href: clientPath(client) }] : [],
      },
    ];
  });
}

export default function LaunchVideosGallery({ works }: GalleryProps) {
  // Placeholder: Tyler to write the real line.
  return <DiscGallery films={resolveFilms(works)} hint={<Draft>Pick a case to play its film.</Draft>} />;
}
