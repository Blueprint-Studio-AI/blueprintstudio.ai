import type { FaqEntry } from "@/components/faq";

export const HOME_FAQS: FaqEntry[] = [
  {
    question: "What is Arch Network?",
    answer: (
      <p>
        Infrastructure for Bitcoin-native capital markets—borrow, earn, swap, and build financial
        apps while keeping settlement local to Bitcoin. It lets institutions and users put their
        Bitcoin to work natively, without bridging, wrapping, or leaving their wallets.
      </p>
    ),
  },
  {
    question: "What makes Arch different from other Bitcoin chains?",
    answer: (
      <>
        <p>
          Most systems execute elsewhere and reconcile with Bitcoin later. Arch is built so
          settlement stays tied to Bitcoin, minimizing compromise. Arch is the only chain that
          executes financial logic and settles those outcomes to Bitcoin.
        </p>
        <p>
          That means institutions and users can issue, trade, and settle without leaving the Bitcoin
          network, preserving Bitcoin’s security and liquidity while making it productive.
        </p>
      </>
    ),
  },
  {
    question: "Why does Arch exist?",
    answer: (
      <>
        <p>
          Bitcoin is valuable but underutilized. Arch makes BTC productive without pushing it onto
          other ecosystems.
        </p>
        <p>
          Today, both users and institutions are forced onto Ethereum, Solana, or other workarounds
          that rely on wrapped BTC, fragile bridges, and custodial solutions to do more with their
          Bitcoin. Arch fixes that. It’s the first chain that lets financial applications execute and
          settle programmable finance directly against native Bitcoin, preserving self-custody and
          unlocking productive yield from BTC itself.
        </p>
      </>
    ),
  },
  {
    question: "How does Arch maintain security?",
    answer: (
      <>
        <p>
          Arch leverages Bitcoin’s security model directly. Validators use threshold cryptography
          (FROST + ROAST) to collectively sign and settle transactions on Bitcoin itself, ensuring
          that:
        </p>
        <ul>
          <li>No single validator controls funds</li>
          <li>Every transaction is finalized with Bitcoin’s immutability</li>
          <li>Institutions retain full custody and compliance alignment</li>
        </ul>
      </>
    ),
  },
  {
    question: "How does Arch interact with wallets?",
    answer: (
      <>
        <p>Arch integrates directly with Bitcoin wallets through Taproot compatibility.</p>
        <p>That means:</p>
        <ul>
          <li>No new wallets</li>
          <li>No wrapped BTC</li>
          <li>No bridging risk</li>
        </ul>
        <p>
          Users can access Arch apps directly through wallets like Xverse, Unisat, Magic Eden, and
          Ledger, keeping their Bitcoin where it belongs.
        </p>
      </>
    ),
  },
  {
    question: "What problems does Arch solve?",
    answer: (
      <>
        <p>Arch fixes what’s been holding Bitcoin back:</p>
        <ul>
          <li>Idle capital: Lets institutions deploy their Bitcoin without bridging or wrapping.</li>
          <li>
            Security risk: Anchors assets directly to Bitcoin’s settlement layer, removing custodian
            and bridge risk.
          </li>
          <li>
            Fragmented liquidity: Keeps liquidity unified under Bitcoin instead of splitting it
            across chains.
          </li>
          <li>Poor UX: Enables borrowing, lending, and trading straight from Bitcoin wallets.</li>
        </ul>
      </>
    ),
  },
  {
    question: "How does Arch make Bitcoin productive?",
    answer: (
      <>
        <p>
          Arch introduces the ArchVM, a Bitcoin-native execution environment that powers integrated
          financial products while settling directly to Bitcoin. Arch&apos;s product suite enables:
        </p>
        <ul>
          <li>Programmable Collateral</li>
          <li>RWAs, Commodities, Derivatives</li>
          <li>Structured yield products</li>
          <li>On-chain trading and credit markets</li>
        </ul>
        <p>All without bridging away from Bitcoin &amp; turning passive BTC into active capital.</p>
      </>
    ),
  },
];
