// THE APERTURE — the photograph, and the coin it becomes. A pure render; prime-v10.css does all
// of it off the vars the reader writes on this element (hero.tsx):
//
//   --close   the lens: the FULL-STAGE photograph clipped to circle(r at cx cy0); r runs from the
//             cover radius (the stage's farthest corner from the centre) to the coin's radius.
//             Once the circle fits inside the frame, the photograph shrinks WITH it (a dolly about
//             the centre, transform only), so the coin holds the whole picture — the towers, the
//             sky, the lit building — not a crop of plain sky. The scale is never less than the
//             circle needs, so the photo always covers its circle.
//   --turn    flip (default): the two faces share that circle and turn on its vertical axis about
//             its centre — photo face 0→180deg, the ₿ face −180→0deg — under one perspective on
//             their parent (WebKit skews a face that carries its own perspective()), each with
//             backface-visibility hidden and, as a belt to those braces, an opacity step at 90deg.
//             A thin rim shows only near edge-on, so the coin never vanishes; each face darkens a
//             little as it turns away. data-turn="flood": the ₿ face rises through the circle from
//             the bottom like a fill line instead.
//
// TWO LAYERS, ON PURPOSE. The lens (full stage, clip-path, never 3D) does the close; the coin (a
// coin-sized box on the circle, holding the two faces) does the turn. At the end of the close
// they show the same pixels — the coin's photo face is the same full-stage photograph at the same
// dolly scale, offset so it lines up — and the lens hands over the instant the turn starts. WebKit
// mis-renders a 3D turn on a full-stage layer (it collapses to a sliver, checked in Playwright's
// WebKit, 2026-09-22); on a coin-sized box it is right.
//
// The ₿ face is BtcCoin (marks.tsx) at the coin's size, centred on the circle; the coin field's
// centre coin is the same two paths at the same size, so at the handoff the field takes over with
// no jump (coin-field.tsx).
//
// PhotoPicture is also the static hero band's photograph (hero.tsx): one art-directed <picture>,
// landscape above 767px and portrait below.

import { getImageProps } from "next/image";
import { V10 } from "@/data/prime-v10";
import { BtcCoin } from "./marks";

const P = V10.photo;

export function PhotoPicture({ className }: { className: string }) {
  const common = { alt: "", sizes: "100vw", quality: 75, loading: "eager", fetchPriority: "high" } as const;
  // With images.unoptimized (next.config) getImageProps returns a src and no srcSet, so the
  // <source> takes whichever it has — without this the phone was served the landscape photo.
  const { props: mobile } = getImageProps({ ...common, ...P.mobile });
  const { props } = getImageProps({ ...common, ...P.desktop });
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile.srcSet ?? mobile.src} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" comes in through props */}
      <img {...props} className={className} />
    </picture>
  );
}

export function Aperture({ ref }: { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className="v10-aperture" aria-hidden>
      {/* the lens: the full-stage photograph under a closing circle — no 3D */}
      <div className="v10-lens">
        <div className="v10-dolly">
          <PhotoPicture className="v10-photo" />
          <div className="v10-scrim" />
        </div>
      </div>
      {/* the coin: a coin-sized box on the circle, its two faces turning in 3D */}
      <div className="v10-coin3d">
        <div className="v10-rim" />
        <div className="v10-face v10-face--photo">
          <div className="v10-face-photo">
            <PhotoPicture className="v10-photo" />
          </div>
          <div className="v10-shade" />
        </div>
        <div className="v10-face v10-face--btc">
          <BtcCoin className="v10-btc-mark" />
          <div className="v10-shade" />
        </div>
      </div>
    </div>
  );
}
