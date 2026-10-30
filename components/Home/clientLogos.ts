// The clients in the home page's logo band, and what their hover card says.
// One table, so the client registry can feed it later.

export type ClientLogo = {
  name: string;
  /** File in public/logos-match-height: every logo sits on a 264px-tall canvas with its own padding. */
  logo: string;
  /** The canvas width, which reserves the logo's space before it loads. */
  w: number;
  /**
   * Moves the logo down (or up, if negative) by this share of its height, so its
   * main line of lettering sits on the band's middle. The canvases centre each
   * logo's whole box, which leaves a sparkle, descenders or a stacked second line
   * pulling the word off the line. Measured from each file's ink; a logo with a
   * big mark or a stacked line goes halfway (BTC, UNI, Arch Network, Logical).
   */
  y?: number;
  /** Drawn smaller, for logos that read heavier than the rest. */
  scale?: number;
  /** Brightness in the grey resting state: under 1 darkens a pale logo, over 1 lightens a dark block. */
  tone?: number;
  /** Opacity in the grey resting state (default 0.5). */
  ink?: number;
  /** What we did for them, in one line, from the services we list for them. */
  line: string;
  /** A still of their work that the site already shows. The card shows it whenever there is one. */
  still?: string;
  /** A page that shows their work. The card links to it, as "See the work", only when this is set. */
  href?: string;
};

const still = (key: string) => `/logos-match-height/stills/${key}.jpg`;

export const CLIENT_LOGOS: ClientLogo[] = [
  { name: "TokenWorks", logo: "tokenworks", w: 636, y: -0.013, line: "Digital transformation, service design, development and product videos.", still: still("tokenworks") },
  { name: "Arch Network", logo: "arch-network", w: 518, y: -0.04, line: "Service design, branding, development and content creation.", still: still("arch-network"), href: "/brands/arch" },
  // Brand only: its app, films and deck stay confidential until launch.
  { name: "Arch Prime", logo: "arch-prime", w: 666, y: -0.023, line: "Brand identity and design system.", still: still("arch-prime"), href: "/brands/arch-prime" },
  { name: "Perena", logo: "perena", w: 682, line: "Landing page, service design and development.", still: still("perena"), href: "/launch-videos" },
  { name: "Jinba", logo: "jinba", w: 561, y: -0.011, line: "Branding, landing page and launch video.", still: still("jinba"), href: "/brands/jinba" },
  { name: "Bump", logo: "bump-wordmark", w: 350, line: "Branding, product design and UX.", still: still("bump") },
  { name: "Logical", logo: "logical", w: 580, y: -0.029, line: "Launch video.", still: still("logical"), href: "/launch-videos" },
  { name: "Pyra", logo: "pyra", w: 476, line: "Three launch videos and content creation.", still: still("pyra"), href: "/launch-videos" },
  { name: "Hildene", logo: "hildene", w: 428, scale: 0.7, tone: 1.5, line: "Service design and content creation." },
  { name: "HoneyB", logo: "honeyb", w: 630, tone: 0.5, line: "Product design, landing page, branding and development.", still: still("honeyb"), href: "/brands/honeyb" },
  { name: "Hashplay", logo: "hashplay", w: 749, tone: 0.42, line: "Landing page, branding and development.", still: still("hashplay") },
  { name: "Bold", logo: "bold", w: 540, y: 0.023, scale: 0.92, line: "Branding, platform UX and landing page." },
  { name: "Cona", logo: "cona", w: 426, y: -0.013, line: "Service design and content creation.", still: still("cona") },
  { name: "DAG", logo: "dag", w: 503, scale: 0.7, ink: 0.32, line: "Branding and merch." },
  { name: "Bitfrost", logo: "bitfrost", w: 526, y: -0.032, line: "Branding and pitch deck.", still: still("bitfrost") },
  { name: "Autara", logo: "autara", w: 525, y: -0.104, line: "Landing page and branding.", still: still("autara"), href: "/brand" },
  { name: "Pregame", logo: "pregame", w: 603, y: 0.013, tone: 0.42, line: "Content creation." },
  { name: "Twelve", logo: "twelve", w: 568, line: "AI automation, service design, development and UX design." },
  { name: "Reshift", logo: "reshift", w: 461, y: 0.009, scale: 0.86, line: "AI automation, development and service design." },
  { name: "PavePower", logo: "pavepower", w: 609, y: 0.028, tone: 0.5, line: "Landing page.", still: still("pavepower") },
  { name: "BTC Summit Vegas", logo: "btc-summit-vegas", w: 370, scale: 0.76, line: "Content creation, immersive video and branding.", still: still("btc-summit-vegas") },
  { name: "Satoshi Bet", logo: "satoshibet", w: 656, line: "Landing page and development." },
  { name: "Panta", logo: "panta", w: 459, y: -0.051, tone: 0.5, line: "Launch video.", still: still("panta") },
  { name: "Herth", logo: "herth", w: 481, y: -0.009, line: "Product design and development.", still: still("herth") },
  { name: "Customer Compass", logo: "customer-compass", w: 471, scale: 0.74, tone: 1.4, line: "Service design and customer research." },
  { name: "Answers From Me", logo: "answers-from-me", w: 575, y: 0.011, tone: 0.6, line: "Service design, AI automation and development." },
  { name: "LivingIP", logo: "livingip", w: 603, line: "Product design and branding.", still: still("livingip") },
  { name: "Uni", logo: "uni", w: 356, y: 0.008, scale: 0.82, tone: 0.85, line: "Branding and landing page.", still: still("uni"), href: "/launch" },
];
