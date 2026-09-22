"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ECOSYSTEM_FILTERS,
  ECOSYSTEM_PARTNERS,
  type EcosystemPartner,
} from "@/data/ecosystem";

function Card({ partner }: { partner: EcosystemPartner }) {
  return (
    <div className="group relative flex min-h-[240px] w-full items-center justify-center overflow-hidden rounded-[20px] border border-light-grey bg-[#fafafa] p-5">
      <Image
        src={partner.logo}
        alt={partner.name}
        width={220}
        height={80}
        className="max-w-[70%] object-contain"
        style={{ width: partner.logoWidth ?? 220 }}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-1.5 text-sm">
        <span>{partner.name}</span>
        <span className="rounded-full border border-light-grey px-2 py-0.5 text-xs">
          {partner.category}
        </span>
      </div>

      <div className="absolute inset-0 bg-light p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="mb-4 flex items-center justify-between border-b border-dark-purple pb-3.5 text-dark-purple">
          <span>{partner.name}</span>
          <span className="rounded-full border border-dark-purple px-2 py-0.5 text-xs">
            {partner.category}
          </span>
        </div>
        <p className="text-[14px] leading-[140%] text-dark-purple">{partner.description}</p>
        <div className="absolute bottom-5 left-5 flex items-center gap-1.5">
          <a href={partner.x} target="_blank" rel="noopener noreferrer" aria-label={`${partner.name} on X`}>
            <Image src="/img/icon-x.svg" alt="" width={18} height={18} />
          </a>
          <a href={partner.web} target="_blank" rel="noopener noreferrer" aria-label={`${partner.name} website`}>
            <Image src="/img/icon-web.svg" alt="" width={18} height={18} />
          </a>
        </div>
      </div>
    </div>
  );
}

export function EcosystemGrid() {
  const [filter, setFilter] = useState<string>("");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ECOSYSTEM_PARTNERS.filter((p) => {
      const matchesFilter = filter === "" || filter === "All" || p.category === filter;
      const matchesQuery = q === "" || p.name.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div className="mx-auto w-[94%] max-w-(--container-site)">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full rounded-full border border-light-grey py-2 pr-10 pl-4 text-sm outline-none focus:border-dark-purple"
          />
          <Image
            src="/img/search.svg"
            alt=""
            width={18}
            height={18}
            aria-hidden
            className="absolute top-1/2 right-4 -translate-y-1/2"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
          {ECOSYSTEM_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm leading-none transition-colors duration-200 ${
                filter === cat
                  ? "border-orange bg-orange text-white"
                  : "border-light-grey hover:border-dark-purple"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((partner) => (
            <Card key={partner.name} partner={partner} />
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center text-grey">No Partner with this name...</div>
      )}
    </div>
  );
}
