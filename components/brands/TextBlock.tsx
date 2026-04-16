interface TextBlockProps {
  children: React.ReactNode;
  /** "quote" renders larger italic serif text; "body" renders standard prose */
  variant?: "quote" | "body";
  align?: "left" | "center";
}

export function TextBlock({ children, variant = "quote", align = "left" }: TextBlockProps) {
  const alignClass = align === "center" ? "mx-auto text-center" : "";

  if (variant === "quote") {
    return (
      <div className={`px-6 sm:px-10 py-12 max-w-3xl ${alignClass}`}>
        <blockquote className="text-[clamp(22px,3.5vw,36px)] leading-[1.25] tracking-tight text-neutral-800">
          {children}
        </blockquote>
      </div>
    );
  }

  return (
    <div className={`px-6 sm:px-10 py-8 max-w-2xl ${alignClass}`}>
      <div className="text-[15px] sm:text-base leading-relaxed text-neutral-600 space-y-4">
        {children}
      </div>
    </div>
  );
}
