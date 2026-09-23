import Link from "next/link";

export function ArchButton({
  href,
  children,
  external,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const cls = `inline-block h-fit w-fit whitespace-nowrap rounded-xl bg-orange px-[22px] py-4 text-white transition-colors duration-400 hover:opacity-90 ${className}`;
  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
