"use client";

import Image from "next/image";

export default function TransitionSection() {
  return (
    <section className="relative bg-white w-full flex flex-col items-center overflow-visible">
      {/* Top padding — white space buffer so thumbprints don't collide with process steps */}
      <div className="w-full h-[80px] sm:h-[120px] bg-neutral-50" />

      {/* Thumbprint image area */}
      <div className="relative w-full">
        <div className="w-full" style={{ aspectRatio: "1440 / 500" }}>
          <Image
            src="/images/thumbprints.png"
            alt=""
            fill
            className="object-cover object-bottom"
            style={{
              mixBlendMode: "multiply",
              opacity: 0.5,
            }}
            sizes="100vw"
            priority
          />
        </div>

        {/* Blue-to-white gradient overlay at the bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[200px] sm:h-[335px]"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.15) 40%, rgba(59, 130, 246, 0.25) 60%, white 100%)",
          }}
        />
      </div>

      {/* Text area */}
      <div className="w-full bg-white flex justify-center px-2.5 sm:px-[60px] pt-8 sm:pt-12 pb-16 sm:pb-24">
        <div className="text-center">
          <h2
            className="font-medium cursor-default"
            style={{
              fontSize: "clamp(22px, 4vw, 36px)",
              lineHeight: "130%",
              letterSpacing: "-1px",
            }}
          >
            <span className="text-neutral-400">We&apos;re not just talk,</span>
            <br />
            <span className="text-black">we let our work speak for itself.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
