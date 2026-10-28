import { workShowcase } from "@/lib/work";
import Draft from "../Draft";
import type { GalleryProps } from "./index";
import DiscGallery from "./launch-videos/DiscGallery";
import type { Film } from "./launch-videos/shared";

// /work/launch-videos opens on a disc player: each film a jewel case, played
// on a big screen once its disc is in (launch-videos/DiscGallery). This side
// runs on the server, so only what the player needs goes to the browser.
export default function LaunchVideosGallery({ works }: GalleryProps) {
  const films: Film[] = works.map((work) => {
    const { vertical: _phone, ...hero } = work.kit.hero;
    return {
      slug: work.slug,
      title: work.title,
      client: work.client.name,
      year: work.year,
      cover: work.kit.stills[0],
      hero,
      links: workShowcase(work).links,
    };
  });
  // Placeholder: Tyler to write the real line.
  return <DiscGallery films={films} hint={<Draft>Pick a case to play its film.</Draft>} />;
}
