// The clients in the home page's logo band, and what their hover card says.
// One table, so the client registry can feed it later.

export type ClientLogo = {
  name: string;
  /** File in public/logos-match-height: every logo sits on a 264px-tall canvas with its own padding. */
  logo: string;
  /** The canvas width, which reserves the logo's space before it loads. */
  w: number;
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
  { name: "TokenWorks", logo: "tokenworks", w: 636, line: "Digital transformation, service design, development and product videos.", still: still("tokenworks") },
  { name: "Arch Network", logo: "arch-network", w: 518, line: "Service design, branding, development and content creation.", still: still("arch-network"), href: "/brands/arch" },
  { name: "Perena", logo: "perena", w: 682, line: "Landing page, service design and development.", still: still("perena"), href: "/launch-videos" },
  { name: "Jinba", logo: "jinba", w: 561, line: "Branding, landing page and launch video.", still: still("jinba"), href: "/brands/jinba" },
  { name: "Bump", logo: "bump-wordmark", w: 350, line: "Branding, product design and UX.", still: still("bump") },
  { name: "Logical", logo: "logical", w: 580, line: "Launch video.", still: still("logical"), href: "/launch-videos" },
  { name: "Pyra", logo: "pyra", w: 476, line: "Three launch videos and content creation.", still: still("pyra"), href: "/launch-videos" },
  { name: "Hildene", logo: "hildene", w: 428, scale: 0.7, tone: 1.5, line: "Service design and content creation." },
  { name: "HoneyB", logo: "honeyb", w: 630, tone: 0.5, line: "Product design, landing page, branding and development.", still: still("honeyb"), href: "/brands/honeyb" },
  { name: "Hashplay", logo: "hashplay", w: 749, tone: 0.42, line: "Landing page, branding and development." },
  { name: "Bold", logo: "bold", w: 540, scale: 0.92, line: "Branding, platform UX and landing page." },
  { name: "Cona", logo: "cona", w: 426, line: "Service design and content creation." },
  { name: "DAG", logo: "dag", w: 503, scale: 0.7, ink: 0.32, line: "Branding and merch." },
  { name: "Bitfrost", logo: "bitfrost", w: 526, line: "Branding and pitch deck." },
  { name: "Autara", logo: "autara", w: 525, line: "Landing page and branding.", still: still("autara"), href: "/brand" },
  { name: "Pregame", logo: "pregame", w: 603, tone: 0.42, line: "Content creation." },
  { name: "Twelve", logo: "twelve", w: 568, line: "AI automation, service design, development and UX design." },
  { name: "Reshift", logo: "reshift", w: 461, scale: 0.86, line: "AI automation, development and service design." },
  { name: "PavePower", logo: "pavepower", w: 609, tone: 0.5, line: "Landing page." },
  { name: "BTC Summit Vegas", logo: "btc-summit-vegas", w: 370, scale: 0.76, line: "Content creation, immersive video and branding.", still: still("btc-summit-vegas") },
  { name: "Satoshi Bet", logo: "satoshibet", w: 656, line: "Landing page and development." },
  { name: "Panta", logo: "panta", w: 459, tone: 0.5, line: "Launch video." },
  { name: "Herth", logo: "herth", w: 481, line: "Product design and development." },
  { name: "Customer Compass", logo: "customer-compass", w: 471, scale: 0.74, tone: 1.4, line: "Service design and customer research." },
  { name: "Answers From Me", logo: "answers-from-me", w: 575, tone: 0.6, line: "Service design, AI automation and development." },
  { name: "LivingIP", logo: "livingip", w: 603, line: "Product design and branding.", still: still("livingip") },
  { name: "Uni", logo: "uni", w: 356, scale: 0.82, tone: 0.85, line: "Branding and landing page.", still: still("uni"), href: "/launch" },
];
