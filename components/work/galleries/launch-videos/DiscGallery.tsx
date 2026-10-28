"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { animate, AnimatePresence, motion, motionValue, useMotionValue, type AnimationPlaybackControls, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { Disc } from "./Disc";
import { JewelCase, RACK_POSES, ROW_POSES, type CasePose, type CaseSize, type Poses } from "./JewelCase";
import { Player, PLAYER_DESK, PLAYER_PHONE, type PlayerStatus } from "./Player";
import { Screen, type FilmEvent, type Osd } from "./Screen";
import { EASE_OUT, FLIGHT_SPRING, POP_SPRING, SEAT_SPRING, wait, type Film, type Spot } from "./shared";

// Launch films as discs. Each film is a jewel case on a rack (a row you swipe
// on a phone); pick one and it opens, its disc lifts out and travels into the
// little player, which spins it up and plays the film on the big screen above.
// The player's keys play and pause, mute, swap to the next or previous disc,
// and eject the disc back into its case. With reduced motion a pick simply
// puts the film on the screen.

const DESK = "(min-width: 1024px)";
const ROW_CASE: CaseSize = { w: 128, h: 114, d: 18 };
// The rack's height: the player's.
const RACK_H = PLAYER_DESK.well + PLAYER_DESK.pad * 2;

/**
 * How the rack stands its cases: five or so turned halfway, covers showing;
 * the more there are, the further they turn spines-out (and a little smaller),
 * as on a shelf of CDs, so nine or ten still fit beside the player. Pads leave
 * room at each end for the end cases.
 */
function rackLayout(n: number): { size: CaseSize; poses: Poses; pad: { l: number; r: number } } {
  const dense = Math.min(1, Math.max(0, (n - 5) / 4));
  const turn = 50 + 18 * dense;
  const size: CaseSize = dense > 0.5 ? { w: 150, h: 134, d: 25 } : { w: 164, h: 146, d: 26 };
  const a = (turn * Math.PI) / 180;
  const reach = (size.w / 2) * Math.cos(a) + (size.d / 2) * Math.sin(a);
  return {
    size,
    poses: { ...RACK_POSES, rest: { ...RACK_POSES.rest, rotateY: turn }, out: { ...RACK_POSES.out, rotateY: turn } },
    pad: { l: Math.round(reach + 12), r: Math.round(reach + 2) },
  };
}
// Degrees a second, once it's up to speed.
const SPIN = 270;

function useMedia(query: string) {
  const [match, setMatch] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

function useInView(ref: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/** The disc's turn: it spins up when it plays and runs down when it stops, like a motor. */
function useSpin(on: boolean, still: boolean): MotionValue<number> {
  const rot = useMotionValue(0);
  const vel = useRef(0);
  useEffect(() => {
    if (still) {
      vel.current = 0;
      return;
    }
    const target = on ? SPIN : 0;
    if (target === 0 && vel.current < 1) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Spins up in about half a second; runs down a little slower.
      const tau = target > vel.current ? 0.32 : 0.5;
      vel.current += (target - vel.current) * (1 - Math.exp(-dt / tau));
      rot.set(rot.get() + vel.current * dt);
      if (target === 0 && vel.current < 1) {
        vel.current = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, still, rot]);
  return rot;
}

interface Flight {
  id: number;
  film: Film;
  from: Spot;
  /**
   * Where it's going, measured every frame (a case may still be moving, or
   * scrolling). `gone`: its case is off the side of the phone's row, so the
   * disc heads for the row's edge and fades on the way.
   */
  to: () => Spot & { gone?: boolean };
  fromRotate: number;
  toRotate: number;
  /** Rise off the spindle first (an eject). */
  pop: boolean;
  /** How high it arcs on the way. */
  arc: number;
  land: () => void;
}

/** A disc in the air, between a case and the player. */
function FlightDisc({ f, size, onDone }: { f: Flight; size: number; onDone: (f: Flight) => void }) {
  const x = useMotionValue(f.from.x - size / 2);
  const y = useMotionValue(f.from.y - size / 2);
  const scale = useMotionValue(f.from.size / size);
  const rotate = useMotionValue(f.fromRotate);
  const opacity = useMotionValue(1);

  useEffect(() => {
    let stopped = false;
    const running: AnimationPlaybackControls[] = [];
    const go = async () => {
      let start = f.from;
      x.set(start.x - size / 2);
      y.set(start.y - size / 2);
      scale.set(start.size / size);
      if (f.pop) {
        const rise = size * 0.16;
        const a = animate(y, start.y - rise - size / 2, POP_SPRING);
        running.push(a, animate(scale, (start.size * 1.05) / size, POP_SPRING), animate(rotate, f.fromRotate + 40, POP_SPRING));
        await a;
        if (stopped) return;
        start = { x: start.x, y: start.y - rise, size: start.size * 1.05 };
      }
      const r0 = rotate.get();
      const p = motionValue(0);
      let arrived = false;
      const arrive = () => {
        if (arrived || stopped) return;
        arrived = true;
        unsub();
        flight.stop();
        onDone(f);
      };
      const unsub = p.on("change", (v) => {
        const to = f.to();
        x.set(start.x + (to.x - start.x) * v - size / 2);
        // Up and over; past the end (the spring's settle) it dips and comes back.
        y.set(start.y + (to.y - start.y) * v - f.arc * Math.sin(Math.PI * v) - size / 2);
        scale.set((start.size + (to.size - start.size) * v) / size);
        rotate.set(r0 + (f.toRotate - r0) * v);
        opacity.set(to.gone ? Math.max(0, Math.min(1, (0.85 - v) / 0.35)) : 1);
        // Hand over the moment it's there (within a pixel or two), not after the spring's last wobble.
        if (v >= 0.995) arrive();
      });
      const flight = animate(p, 1, FLIGHT_SPRING);
      running.push(flight);
      await flight;
      arrive();
    };
    go();
    return () => {
      stopped = true;
      running.forEach((c) => c.stop());
    };
    // One flight per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div className="pointer-events-none absolute left-0 top-0 z-30" style={{ x, y, scale, opacity, width: size, height: size }}>
      <Disc film={f.film} size={size} rotate={rotate} />
    </motion.div>
  );
}

type Cmd = { type: "insert"; slug: string } | { type: "eject" };

const withKey = (set: ReadonlySet<string>, key: string, on: boolean): ReadonlySet<string> => {
  if (set.has(key) === on) return set;
  const next = new Set(set);
  if (on) next.add(key);
  else next.delete(key);
  return next;
};

export default function DiscGallery({ films, hint }: { films: Film[]; /** The line shown before a film is picked. */ hint: ReactNode }) {
  const reduce = usePrefersReducedMotion();
  const desk = useMedia(DESK);
  const rootRef = useRef<HTMLDivElement>(null);
  const wellRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const discEls = useRef<Record<string, HTMLDivElement | null>>({});
  const inView = useInView(rootRef);

  // Where everything is.
  const [loaded, setLoaded] = useState<string | null>(null); // resting in the player
  const [away, setAway] = useState<ReadonlySet<string>>(() => new Set()); // discs out of their cases
  const [present, setPresent] = useState<ReadonlySet<string>>(() => new Set()); // cases forward, lid open
  const [lifted, setLifted] = useState<ReadonlySet<string>>(() => new Set()); // discs raised off their trays
  const [out, setOut] = useState<string | null>(null); // the case whose disc is in (or going into) the player
  const [flights, setFlights] = useState<Flight[]>([]);
  // What's on.
  const [screen, setScreen] = useState<string | null>(null);
  const [mounted, setMounted] = useState<ReadonlySet<string>>(() => new Set());
  const [playing, setPlaying] = useState(true);
  // Films ask for sound; where the browser refuses, the player starts muted and says so (soundHint).
  const [muted, setMuted] = useState(false);
  const [soundHint, setSoundHint] = useState(false);
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set()); // YouTube failed: kit loop instead
  const [reading, setReading] = useState(false);
  const [time, setTime] = useState<{ t: number; length: number } | null>(null);
  const [sound, setSound] = useState<Record<string, boolean>>({});
  const [osd, setOsd] = useState<Osd>(null);
  const [hover, setHover] = useState<string | null>(null);

  const spin = useSpin(!!loaded && playing && inView, reduce);
  const P = desk === false ? PLAYER_PHONE : PLAYER_DESK;

  // Refs for the choreography, which runs across awaits.
  const heading = useRef<string | null>(null); // in the player, or on its way there
  const busy = useRef(false);
  const pending = useRef<Cmd | null>(null);
  const returning = useRef(new Map<string, Promise<void>>());
  const flightId = useRef(0);
  const live = useRef({ reduce, desk, playing, failed, soundHint });
  live.current = { reduce, desk, playing, failed, soundHint };
  const osdTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(osdTimer.current), []);

  // A message on the screen: gone after a moment, or held (`true`) until the next one.
  const flash = useCallback((text: string, hold: boolean | number = false) => {
    clearTimeout(osdTimer.current);
    setOsd({ text, key: performance.now() });
    if (hold === true) return;
    osdTimer.current = setTimeout(
      () => setOsd(live.current.playing ? null : { text: "❚❚ Pause", key: performance.now() }),
      typeof hold === "number" ? hold : 1600
    );
  }, []);

  /** The full film from YouTube, unless it has none or it has failed here. */
  const onYouTube = (slug: string) => !!films.find((f) => f.slug === slug)?.youtube && !live.current.failed.has(slug);
  const playFlash = () => (live.current.soundHint ? flash("Muted · press the sound key", 4000) : flash("▶ Play"));

  const spotOf = (el: Element | null | undefined): Spot => {
    const root = rootRef.current?.getBoundingClientRect();
    if (!el || !root) return { x: 0, y: 0, size: 0 };
    const r = el.getBoundingClientRect();
    return { x: r.left - root.left + r.width / 2, y: r.top - root.top + r.height / 2, size: r.width };
  };

  const fly = (f: Omit<Flight, "id">) =>
    new Promise<void>((resolve) => {
      const id = ++flightId.current;
      setFlights((list) => [
        ...list,
        {
          ...f,
          id,
          land: () => {
            f.land();
            resolve();
          },
        },
      ]);
    });

  const landed = (f: Flight) => {
    // One batch: the flight's disc goes, the resting disc appears in the same frame.
    setFlights((list) => list.filter((x) => x.id !== f.id));
    f.land();
  };

  const caseEl = (slug: string) => discEls.current[slug]?.closest("[data-case]") as HTMLElement | null | undefined;

  /** On a phone, whether a case is in view in its row. */
  const inRow = (slug: string) => {
    const row = rowRef.current?.getBoundingClientRect();
    const el = caseEl(slug)?.getBoundingClientRect();
    return !row || !el || (el.left >= row.left - 2 && el.right <= row.right + 2);
  };

  /** On a phone, scroll a case into view in its row. Resolves once it's about there. */
  const reveal = async (slug: string) => {
    const row = rowRef.current;
    const el = caseEl(slug);
    if (live.current.desk || !row || !el || inRow(slug)) return;
    const left = row.scrollLeft + el.getBoundingClientRect().left - row.getBoundingClientRect().left - (row.clientWidth - el.offsetWidth) / 2;
    row.scrollTo({ left, behavior: live.current.reduce ? "auto" : "smooth" });
    if (!live.current.reduce) await wait(320);
  };

  /** Where a case's disc sits, for a disc coming home; on a phone, the row's edge when it's out of view. */
  const homeSpot = (slug: string): Spot & { gone?: boolean } => {
    const spot = spotOf(discEls.current[slug]);
    const row = rowRef.current;
    if (live.current.desk || !row || inRow(slug)) return spot;
    const r = spotOf(row);
    // Inside the row (and the page), never past its edge.
    const room = r.size / 2 - spot.size / 2;
    return { ...spot, x: Math.max(r.x - room, Math.min(r.x + room, spot.x)), gone: true };
  };

  /** Send a disc home. `alone`: a plain eject, so on a phone its case scrolls into view to take it. */
  const eject = async (slug: string, alone = false) => {
    let done = () => {};
    returning.current.set(slug, new Promise<void>((r) => (done = r)));
    if (heading.current === slug) heading.current = null;
    setScreen(null);
    setReading(false);
    setTime(null);
    setOsd(null);
    if (live.current.reduce) {
      setLoaded(null);
      setAway((s) => withKey(s, slug, false));
      setOut((o) => (o === slug ? null : o));
      returning.current.delete(slug);
      done();
      return;
    }
    if (alone) await reveal(slug);
    const film = films.find((f) => f.slug === slug)!;
    const from = spotOf(wellRef.current);
    const r = spin.get();
    setPresent((s) => withKey(s, slug, true));
    setLifted((s) => withKey(s, slug, true));
    const home = fly({
      film,
      from,
      to: () => homeSpot(slug),
      fromRotate: r,
      toRotate: Math.ceil(r / 360) * 360 + 360,
      pop: true,
      arc: live.current.desk ? 60 : 36,
      land: () => setAway((s) => withKey(s, slug, false)),
    });
    setLoaded(null);
    await home;
    // It drops onto its tray and the lid shuts over it.
    setLifted((s) => withKey(s, slug, false));
    await wait(150);
    setPresent((s) => withKey(s, slug, false));
    setOut((o) => (o === slug ? null : o));
    returning.current.delete(slug);
    done();
  };

  const insert = async (slug: string) => {
    const prev = heading.current;
    if (prev === slug) {
      if (!live.current.playing) {
        setPlaying(true);
        flash("▶ Play");
      }
      return;
    }
    await returning.current.get(slug);
    heading.current = slug;
    setMounted((s) => withKey(s, slug, true)); // its poster loads on the way
    setOut(slug);
    setPlaying(true);
    if (live.current.reduce) {
      if (prev) eject(prev);
      setAway((s) => withKey(s, slug, true));
      setLoaded(slug);
      setScreen(slug);
      setTime(null);
      // A YouTube film reads until it plays (onFilm).
      setReading(onYouTube(slug));
      if (!onYouTube(slug)) playFlash();
      return;
    }
    if (prev) eject(prev); // the two discs pass each other
    await reveal(slug); // a phone's next or previous disc may be out of view
    const film = films.find((f) => f.slug === slug)!;
    setPresent((s) => withKey(s, slug, true));
    await wait(100);
    setLifted((s) => withKey(s, slug, true));
    await wait(210);
    const from = spotOf(discEls.current[slug]);
    const turn = 360 + 40;
    const trip = fly({
      film,
      from,
      to: () => spotOf(wellRef.current),
      fromRotate: 0,
      toRotate: turn,
      pop: false,
      arc: live.current.desk ? 64 : 40,
      land: () => {
        spin.set(turn);
        setLoaded(slug);
        setReading(true);
        setTime(null);
      },
    });
    setAway((s) => withKey(s, slug, true));
    // Behind the disc, the case shuts and steps back into the rack.
    setTimeout(() => setLifted((s) => withKey(s, slug, false)), 80);
    setTimeout(() => setPresent((s) => withKey(s, slug, false)), 220);
    await trip;
    // The whir: the disc spins up and the display reads it, then the screen comes on, on the
    // film's poster. A YouTube film reads on until it plays (onFilm); a kit loop is there at once.
    await wait(300);
    if (heading.current !== slug) return;
    setScreen(slug);
    if (!onYouTube(slug)) {
      setReading(false);
      playFlash();
    }
  };

  const onFilm = (slug: string, e: FilmEvent) => {
    if (slug !== heading.current) return;
    if (e === "playing") {
      setReading(false);
      playFlash();
    } else if (e === "muted") {
      live.current.soundHint = true;
      setMuted(true);
      setSoundHint(true);
    } else if (e === "ended") {
      setPlaying(false);
      flash("■ End", true);
    } else if (e === "failed") {
      // Play the kit's loop instead.
      setFailed((s) => withKey(s, slug, true));
      setReading(false);
      playFlash();
    }
  };

  const run = (cmd: Cmd) => {
    if (busy.current) {
      pending.current = cmd;
      return;
    }
    busy.current = true;
    (async () => {
      let next: Cmd | null = cmd;
      while (next) {
        pending.current = null;
        if (next.type === "insert") await insert(next.slug);
        else if (heading.current) await eject(heading.current, true);
        next = pending.current;
      }
      busy.current = false;
    })();
  };

  const at = (slug: string | null) => films.findIndex((f) => f.slug === slug);
  const step = (by: 1 | -1) => {
    const i = at(heading.current);
    const next = i === -1 ? (by === 1 ? 0 : films.length - 1) : (i + by + films.length) % films.length;
    run({ type: "insert", slug: films[next].slug });
  };
  const togglePlay = () => {
    if (!heading.current) {
      run({ type: "insert", slug: films[0].slug });
      return;
    }
    const next = !playing;
    setPlaying(next);
    if (next) flash("▶ Play");
    else flash("❚❚ Pause", true);
  };
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setSoundHint(false);
    flash(next ? "Mute" : "Sound on");
  };

  const film = films.find((f) => f.slug === loaded) ?? null;
  // A YouTube film has sound; a kit loop only once its clip says so (most are cut silent).
  const filmSound = !!film && (film.youtube && !failed.has(film.slug) ? true : !!film.hero.src && !!sound[film.slug]);
  const status: PlayerStatus = !film ? "empty" : reading ? "reading" : playing ? "playing" : "paused";
  const shown = films.find((f) => f.slug === (screen ?? heading.current)) ?? null;

  const pose = (slug: string): CasePose => (present.has(slug) ? "present" : hover === slug ? "hover" : out === slug ? "out" : "rest");

  const caseProps = (f: Film, i: number) => ({
    film: f,
    index: i,
    pose: pose(f.slug),
    open: present.has(f.slug),
    peek: hover === f.slug && !present.has(f.slug) && !away.has(f.slug),
    lifted: lifted.has(f.slug),
    discHome: !away.has(f.slug),
    lit: out === f.slug,
    instant: reduce,
    discRef: (el: HTMLDivElement | null) => {
      discEls.current[f.slug] = el;
    },
  });

  const pick = (slug: string) => run({ type: "insert", slug });
  const label = (f: Film) => `${heading.current === f.slug ? "Playing" : "Play"} ${f.title}, ${f.client}, ${f.year}`;

  const player = (
    <Player
      size={P}
      film={film}
      index={at(loaded)}
      count={films.length}
      status={status}
      time={time?.t ?? null}
      progress={time && time.length > 0 ? Math.min(1, time.t / time.length) : null}
      length={time && time.length > 0 ? time.length : null}
      grille={desk !== false}
      muted={muted}
      sound={filmSound}
      soundHint={soundHint && muted && !!film}
      reduce={reduce}
      onPlay={togglePlay}
      onPrev={() => step(-1)}
      onNext={() => step(1)}
      onMute={toggleMute}
      onEject={() => run({ type: "eject" })}
      wellRef={wellRef}
    >
      {film && (
        // Dropped onto the spindle, it settles.
        <motion.div key={film.slug} initial={reduce ? false : { scale: 1.045 }} animate={{ scale: 1 }} transition={SEAT_SPRING}>
          <Disc film={film} size={P.disc} rotate={spin} />
        </motion.div>
      )}
    </Player>
  );

  return (
    <section aria-label="Launch films" className="mx-auto w-full max-w-[1000px] px-2.5 pb-20 sm:px-6 sm:pb-24 lg:pb-28">
      <div ref={rootRef} className="relative">
        {/* What's playing, and where it links: as its Showcase does, plus its own place on this page */}
        <div className="flex min-h-[100px] flex-wrap items-end justify-between gap-x-6 gap-y-2 pb-4 sm:min-h-[56px] sm:items-center lg:pb-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown ? (
              <motion.div
                key={shown.slug}
                className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                <p className="min-w-0 text-[15px] leading-[1.35] lg:text-base">
                  <span className="font-medium text-black">{shown.client}</span>
                  <span aria-hidden className="mx-2 text-neutral-300">
                    ·
                  </span>
                  <span className="text-neutral-500">
                    {shown.title}, <span className="tabular-nums">{shown.year}</span>
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {shown.piece && (
                    <a
                      href={`#${shown.piece}`}
                      className="group/link inline-flex h-9 items-center gap-1.5 rounded-full bg-black/[0.05] px-4 text-sm font-medium text-black transition-colors duration-200 hover:bg-black/[0.09]"
                    >
                      About the film
                      <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:translate-y-0.5" />
                    </a>
                  )}
                  {shown.links.map((link) =>
                    link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener"
                        className="group/link inline-flex h-9 items-center gap-1.5 rounded-full bg-neutral-900 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-black"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group/link inline-flex h-9 items-center gap-1.5 rounded-full bg-black/[0.05] px-4 text-sm font-medium text-black transition-colors duration-200 hover:bg-black/[0.09]"
                      >
                        {link.label}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:translate-x-0.5" />
                      </Link>
                    )
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                className="text-[15px] leading-[1.35] text-neutral-500 lg:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                {hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* The screen: a little narrower than the console under it, as a set on a sideboard */}
        <div className="mb-5 lg:mx-auto lg:mb-7 lg:max-w-[800px]">
          <Screen
            films={films}
            current={screen}
            mounted={mounted}
            play={playing && inView}
            muted={muted}
            instant={reduce}
            osd={osd}
            standby="No disc"
            onToggle={togglePlay}
            onTime={(t, length) => setTime({ t, length })}
            onSound={(slug, s) => setSound((m) => (m[slug] === s ? m : { ...m, [slug]: s }))}
            onFilm={onFilm}
            failed={failed}
            stageRef={stageRef}
          />
        </div>

        {desk === null ? (
          // Before the first layout pass: the machine's room, held.
          <div aria-hidden="true" className="h-[369px] lg:h-[216px]" />
        ) : desk ? (
          <div className="flex items-end gap-6 xl:gap-8" style={{ height: RACK_H }}>
            <div className="w-[392px] shrink-0 xl:w-[420px]">{player}</div>
            <Rack films={films} caseProps={caseProps} pose={pose} hover={hover} setHover={setHover} onPick={pick} label={label} />
          </div>
        ) : (
          <div>
            <div className="max-w-[460px] sm:mx-auto">{player}</div>
            <div
              ref={rowRef}
              data-lenis-prevent
              className="-mx-5 mt-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 pt-[60px] [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
            >
              {films.map((f, i) => (
                <button
                  key={f.slug}
                  type="button"
                  data-case
                  onClick={() => pick(f.slug)}
                  aria-label={label(f)}
                  aria-pressed={out === f.slug}
                  className="group/case shrink-0 snap-start scroll-ml-5 rounded-[6px] text-left outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] sm:scroll-ml-6"
                  style={{ width: ROW_CASE.w }}
                >
                  <motion.div className="relative [perspective:700px]" style={{ height: ROW_CASE.h }} whileTap={reduce ? undefined : { scale: 0.97 }}>
                    <JewelCase {...caseProps(f, i)} size={ROW_CASE} poses={ROW_POSES} />
                  </motion.div>
                  <span className="mt-3 block text-[13px] font-medium leading-[1.3] text-black">{f.client}</span>
                  <span className="block truncate text-[12px] leading-[1.35] text-neutral-500">{f.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* For screen readers: what's on, when it changes */}
        <p className="sr-only" aria-live="polite">
          {film && !reading ? `Playing ${film.title}, ${film.client}, ${film.year}` : ""}
        </p>

        {flights.map((f) => (
          <FlightDisc key={f.id} f={f} size={P.disc} onDone={landed} />
        ))}
      </div>
    </section>
  );
}

/** The rack: cases standing in a row, spines out. Flat buttons over them do the pointing. */
function Rack({
  films,
  caseProps,
  pose,
  hover,
  setHover,
  onPick,
  label,
}: {
  films: Film[];
  caseProps: (f: Film, i: number) => Omit<Parameters<typeof JewelCase>[0], "size" | "poses">;
  pose: (slug: string) => CasePose;
  hover: string | null;
  setHover: (slug: string | null) => void;
  onPick: (slug: string) => void;
  label: (f: Film) => string;
}) {
  const n = films.length;
  const { size, poses, pad } = rackLayout(n);
  const { w, h } = size;
  // Each case's centre along the rack.
  const at = (i: number) => `calc(${pad.l}px + (100% - ${pad.l + pad.r}px) * ${n > 1 ? i / (n - 1) : 0.5})`;
  const span = `calc((100% - ${pad.l + pad.r}px) / ${Math.max(1, n - 1)})`;

  return (
    <div className="relative h-full min-w-0 flex-1 [perspective-origin:50%_8%] [perspective:1400px]">
      {films.map((f, i) => {
        const p = pose(f.slug);
        return (
          <div
            key={f.slug}
            className="pointer-events-none absolute [transform-style:preserve-3d]"
            style={{ left: `calc(${at(i)} - ${w / 2}px)`, bottom: 4, width: w, height: h, zIndex: p === "present" ? 30 : p === "hover" ? 20 : i }}
          >
            {/* Its shadow on the shelf */}
            <motion.div
              aria-hidden="true"
              className="absolute -bottom-[10px] left-[8%] h-[14px] w-[84%] rounded-[50%] bg-black/25 blur-[6px]"
              initial={false}
              animate={{ opacity: p === "rest" ? 0.9 : 0.45, scaleX: p === "rest" ? 0.85 : 1.05 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            />
            <JewelCase {...caseProps(f, i)} size={size} poses={poses} />
          </div>
        );
      })}
      {films.map((f, i) => (
        <button
          key={f.slug}
          type="button"
          aria-label={label(f)}
          aria-pressed={caseProps(f, i).lit}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHover(f.slug)}
          onPointerLeave={() => setHover(null)}
          onFocus={(e) => e.currentTarget.matches(":focus-visible") && setHover(f.slug)}
          onBlur={() => setHover(null)}
          onClick={() => onPick(f.slug)}
          className="absolute bottom-0 z-40 cursor-pointer rounded-[8px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          style={{
            // The case and the room it rises into.
            height: h + 36,
            left: i === 0 ? 0 : `calc(${at(i)} - ${span} / 2)`,
            width: i === 0 ? `calc(${at(0)} + ${span} / 2)` : i === n - 1 ? `calc(100% - ${at(i)} + ${span} / 2)` : span,
          }}
        />
      ))}
    </div>
  );
}
