import Image from "next/image";
import { cn } from "@/lib/utils";

export default function GalleryTrack({ images, imageClassName, imgClassName, sizes }: { images: string[]; imageClassName?: string; imgClassName?: string; sizes?: string }) {
  return (
    <div className="flex items-center gap-4 shrink-0">
      {images.map((src, i) => (
        <div key={i} className={cn("relative rounded-xl overflow-hidden flex-shrink-0", imageClassName ?? "w-64 aspect-video")}>
          <Image src={src} alt="" fill sizes={sizes ?? "256px"} className={cn("object-cover", imgClassName)} />
        </div>
      ))}
    </div>
  );
}
