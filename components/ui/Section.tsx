import { HTMLAttributes, ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export default function Section({ children, className, ...props } : SectionProps) {
  return (
    <section className={
      `flex-1 flex justify-center items-center flex-col
      px-6
      sm:px-[60px]
      ${className ?? ""}
      `
    }>
      {children}
    </section>
  );
}