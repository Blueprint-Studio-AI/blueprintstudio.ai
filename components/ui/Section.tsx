import { HTMLAttributes, ReactNode } from "react";

type SectionProps = {
  children?: ReactNode;
  semantic?: "section" | "div";
} & HTMLAttributes<HTMLElement>;

export default function Section({ children, className, semantic = "section", ...props } : SectionProps) {

  const style =
      `flex-1 flex justify-center items-center flex-col
      px-2.5
      sm:px-[60px]
      ${className ?? ""}
      `
  
  if (semantic === "section") return (
    <section className={style}>
      {children}
    </section>
  )

  if (semantic ==="div") return (
    <div className={style}>
      {children}
    </div>
  );
}