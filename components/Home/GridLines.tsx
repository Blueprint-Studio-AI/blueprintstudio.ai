// The page's drawing grid. OuterLines frame a section (dashed on small screens,
// solid from `custom` up); InnerLines are the dashed rules at an InnerContainer's
// edges on wide screens. HRule spans an InnerContainer, edge to edge.

export function OuterLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex justify-center px-2.5 sm:px-[60px]">
      <div className="relative flex w-full flex-1 justify-center">
        <div className="line-dash-y absolute bottom-0 left-0 top-0 custom:hidden" />
        <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-neutral-300 custom:block" />
        <div className="line-dash-y absolute bottom-0 right-0 top-0 custom:hidden" />
        <div className="absolute bottom-0 right-0 top-0 hidden w-px bg-neutral-300 custom:block" />
      </div>
    </div>
  );
}

export function InnerLines() {
  return (
    <>
      <div aria-hidden className="line-dash-y pointer-events-none absolute bottom-0 left-0 top-0 hidden custom:block" />
      <div aria-hidden className="line-dash-y pointer-events-none absolute bottom-0 right-0 top-0 hidden custom:block" />
    </>
  );
}

export function HRule() {
  return <div aria-hidden className="line-dash-x" />;
}
