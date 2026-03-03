import GalleryTrack from "./GalleryTrack";

export default function MarqueeGalleryRow({ reverse = false, images, imageClassName, imgClassName, sizes }: { reverse?: boolean; images: string[]; imageClassName?: string; imgClassName?: string; sizes?: string }) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, hsl(var(--neutral-50)), transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, hsl(var(--neutral-50)), transparent)" }}
      />
      <div
        className={`flex w-max ${reverse ? "animate-gallery-scroll-reverse" : "animate-gallery-scroll"}`}
        style={{ willChange: "transform", backfaceVisibility: "hidden" }}
      >
        <GalleryTrack images={images} imageClassName={imageClassName} imgClassName={imgClassName} sizes={sizes} />
        <div className="pl-4">
          <GalleryTrack images={images} imageClassName={imageClassName} imgClassName={imgClassName} sizes={sizes} />
        </div>
      </div>
    </div>
  );
}
