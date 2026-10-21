// The site's outer construction lines, redrawn over a section's own background:
// dashed on small screens, solid from `custom` up (as on the home page).
export default function FrameLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex justify-center px-2.5 sm:px-[60px]">
      <div className="relative flex w-full flex-1 justify-center">
        <div className="absolute bottom-0 left-0 top-0 line-dash-y custom:hidden" />
        <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-neutral-300 custom:block" />
        <div className="absolute bottom-0 right-0 top-0 line-dash-y custom:hidden" />
        <div className="absolute bottom-0 right-0 top-0 hidden w-px bg-neutral-300 custom:block" />
      </div>
    </div>
  );
}
