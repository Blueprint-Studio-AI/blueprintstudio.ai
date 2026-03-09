import Image from "next/image";
import { cn } from "@/lib/utils";

export default function BrandPicker<T extends { id: string; logo: string; name: string }>({
  brands,
  selectedId,
  onSelect,
}: {
  brands: T[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 items-center justify-center md:justify-start h-[72px]">
      {brands.map((brand) => {
        const isActive = brand.id === selectedId;
        return (
          <button
            key={brand.id}
            onClick={() => onSelect(brand.id)}
            className={cn(
              "cursor-pointer flex-shrink-0 transition-all duration-300 rounded-lg p-1 bg-white shadow-[0_2.157px_8.843px_0_rgba(0,0,0,0.34)]",
              isActive ? "w-[72px] h-[72px] opacity-100" : "w-[60px] h-[60px] opacity-40 hover:opacity-70"
            )}
          >
            <div className="relative w-full h-full overflow-hidden rounded-md">
              <Image src={brand.logo} alt={brand.name} fill sizes="72px" loading="eager" className="object-cover" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
