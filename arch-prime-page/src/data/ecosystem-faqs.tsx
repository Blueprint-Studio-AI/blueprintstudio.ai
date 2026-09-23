import type { FaqEntry } from "@/components/faq";
import { EXTERNAL } from "@/lib/site";

export const ECOSYSTEM_FAQS: FaqEntry[] = [
  {
    question: "What is the ArchVM?",
    answer: (
      <>
        <p>The ArchVM is a high-performance execution environment purpose-built for Bitcoin.</p>
        <p>It offers:</p>
        <ul>
          <li>Sub-second block times for a smooth user experience</li>
          <li>Parallelized execution for institutional-grade throughput</li>
          <li>UTXO-awareness, allowing direct Bitcoin settlement</li>
          <li>Composability between applications, unlike siloed L2s</li>
        </ul>
        <p>
          It’s effectively the virtual machine Bitcoin never had, bringing the performance of Solana
          to the world’s most trusted asset.
        </p>
      </>
    ),
  },
  {
    question: "What can be built on Arch?",
    answer: (
      <>
        <p>
          Lending unlocks everything. Scalable Bitcoin-backed credit is the foundation for
          derivatives, structured products, and yield — none of which exist on Bitcoin today because
          the risk infrastructure hasn&apos;t existed.
        </p>
        <p>
          Arch combines a vertically integrated product suite with high-performance deterministic
          execution and Bitcoin settlement to scale Bitcoin-backed credit — the missing foundation for
          Bitcoin capital markets. With scalable credit in place, higher-order financial products
          follow: structured notes, derivatives, and a new market built entirely around Bitcoin
          collateral.
        </p>
        <ul>
          <li>Structured Products, Derivatives</li>
          <li>Repo Markets</li>
          <li>RWAs, ETFs</li>
        </ul>
      </>
    ),
  },
  {
    question: "How does Arch handle transaction speed and finality?",
    answer: (
      <>
        <ul>
          <li>Soft confirmations: Under one second (via Arch consensus)</li>
          <li>Final settlement: On Bitcoin block inclusion</li>
          <li>
            Rollback and Reapply: If Bitcoin reorgs occur, Arch deterministically reverts only
            affected transactions, maintaining consistency and uptime.
          </li>
        </ul>
        <p>The result is institutional-grade performance combined with Bitcoin-grade security.</p>
      </>
    ),
  },
  {
    question: "How can institutions and developers get involved?",
    answer: (
      <ul>
        <li>Institutions: Reach out to the Arch team to issue or integrate tokenized assets on Bitcoin.</li>
        <li>
          Developers:
          <ul>
            <li>
              Read{" "}
              <a href="http://book.arch.network/" target="_blank" rel="noopener noreferrer">
                The Arch Book
              </a>
            </li>
            <li>
              Join the{" "}
              <a
                href={EXTERNAL.discord}
                target="_blank"
                rel="noopener noreferrer"
              >
                Arch Discord
              </a>
            </li>
            <li>
              Apply via the{" "}
              <a href="https://rfs.arch.network/" target="_blank" rel="noopener noreferrer">
                Request for Startups
              </a>
            </li>
          </ul>
        </li>
      </ul>
    ),
  },
  {
    question: "What is the Titan Indexer?",
    answer: (
      <>
        <p>Titan is Arch’s high-performance Bitcoin indexer, built to track:</p>
        <ul>
          <li>Mempool-level data</li>
          <li>Ordinals and Runes transactions</li>
          <li>UTXO states across apps</li>
        </ul>
        <p>It enables instant data indexing, powering Bitcoin-native DeFi with real-time accuracy.</p>
      </>
    ),
  },
];
