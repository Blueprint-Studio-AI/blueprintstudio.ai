import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}
