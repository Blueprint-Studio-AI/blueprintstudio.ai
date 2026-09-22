export type EcosystemCategory = "Wallet" | "Fintech" | "Social" | "Consumer" | "DeFi";

export type EcosystemPartner = {
  name: string;
  category: EcosystemCategory;
  logo: string;
  /** Rendered logo width in the ecosystem card (px). Defaults to 220 — set
   *  lower for lockups that read optically larger than their neighbors. */
  logoWidth?: number;
  description: string;
  x: string;
  web: string;
};

export const ECOSYSTEM_FILTERS: (EcosystemCategory | "All")[] = [
  "All",
  "Wallet",
  "Fintech",
  "Social",
  "Consumer",
  "DeFi",
];

export const ECOSYSTEM_PARTNERS: EcosystemPartner[] = [
  {
    name: "Chaos Labs",
    category: "DeFi",
    logo: "/img/ecosystem/chaos-labs.svg",
    description:
      "The official oracle provider for Arch, Chaos Labs turns complex, fragmented onchain and offchain market data into decision-ready, institutional-grade intelligence for protocols and institutions.",
    x: "http://x.com/chaos_labs",
    web: "https://chaoslabs.xyz/",
  },
  {
    name: "Bump",
    category: "Consumer",
    logo: "/img/ecosystem/bump.svg",
    logoWidth: 165,
    description: "The gateway to Bitcoin’s token economy.",
    x: "https://x.com/BUMPbtc",
    web: "https://bump.fun/",
  },
  {
    name: "HoneyB",
    category: "DeFi",
    logo: "/img/ecosystem/honey-b.svg",
    description:
      "HoneyB is the asset management & structured product marketplace for the Arch Ecosystem. Earn institutional-grade yield, powered by Bitcoin and real-world assets.",
    x: "https://x.com/HoneyB_BTC",
    web: "https://www.honeybtc.com/",
  },
  {
    name: "Gauntlet",
    category: "DeFi",
    logo: "/img/ecosystem/gauntlet.svg",
    description:
      "Gauntlet is crypto's premier yield curator, delivering data-driven strategies for capital allocators, fintechs, financial institutions, and stablecoin issuers. Gauntlet does deep analysis on risk-managed systems and vault strategy curation.",
    x: "https://x.com/gauntlet_xyz",
    web: "http://gauntlet.xyz",
  },
  {
    name: "Wasabi",
    category: "DeFi",
    logo: "/img/ecosystem/wasabi.svg",
    description: "Perps trading for runes, ordinals, and other UTXO assets.",
    x: "http://x.com/wasabi_protocol",
    web: "http://wasabi.xyz",
  },
  {
    name: "Fordefi",
    category: "Wallet",
    logo: "/img/ecosystem/fordefi.svg",
    description:
      "Fordefi's comprehensive MPC wallet platform and web3 gateway enables you to securely self-custody your private keys and seamlessly connect to DeFi opportunities on Arch. One MPC Wallet for Treasury Management, Trading Operations, RWAs, Stablecoins, Payments, and More designed for enterprise requirements",
    x: "https://x.com/FordefiHQ",
    web: "http://fordefi.com",
  },
  {
    name: "Anchorage",
    category: "Wallet",
    logo: "/img/ecosystem/anchorage.svg",
    description:
      "Anchorage Digital is a regulated crypto platform that provides institutions with integrated financial services and infrastructure solutions. Anchorage offers custodial solutions integrated with the Arch Network.",
    x: "https://x.com/Anchorage",
    web: "http://anchorage.com",
  },
  {
    name: "Chintai",
    category: "DeFi",
    logo: "/img/ecosystem/chintai.svg",
    description:
      "An end-to-end Digital Assets platform. Regulated and licensed by the Monetary Authority of Singapore.",
    x: "https://x.com/ChintaiNetwork",
    web: "http://chintai.io",
  },
  {
    name: "Kinesis",
    category: "Fintech",
    logo: "/img/ecosystem/kinesis.svg",
    description:
      "Kinesis is a monetary system making physical gold and silver globally accessible for spending, saving and trading - with over 50% of revenue shared as yields.",
    x: "https://x.com/KinesisMonetary",
    web: "https://kinesis.money/",
  },
  {
    name: "Xverse",
    category: "Wallet",
    logo: "/img/ecosystem/xverse.svg",
    description: "Buy and trade Bitcoin, Runes, Ordinals, and APL tokens all in one interface.",
    x: "https://x.com/XverseApp",
    web: "https://www.xverse.app/",
  },
  {
    name: "Asigna",
    category: "Wallet",
    logo: "/img/ecosystem/asigna.svg",
    description:
      "Asigna is the only multisig infrastructure designed specifically for Bitcoin L1 and its expanding ecosystem of L2s and metaprotocols.",
    x: "https://x.com/asignaio",
    web: "https://www.asigna.io/",
  },
];
