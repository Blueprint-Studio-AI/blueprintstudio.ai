import { ProjectProps } from "../types";
import TikTokCarousel from "../../template/TikTokCarousel";
import Card from "../../template/TikTokCarousel/Card";

export default function IDScanner({ isActive }: ProjectProps) {
  return (
    <TikTokCarousel isActive={isActive}>
      <Card>
        <div style={{ zIndex: "10" }}>
          <h1 className="text-black">ReportGPT</h1>
          <p className="text-black">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus
            quasi molestiae debitis earum porro ipsum quaerat, ea necessitatibus
            atque reprehenderit neque, repellat sed in possimus quisquam, iure
            nostrum perspiciatis.
          </p>
          <div className="w-6 h-6 bg-yellow-300" />
          <div className="w-6 h-6 bg-yellow-400" />
          <div className="w-6 h-6 bg-yellow-500" />
          <div className="w-6 h-6 bg-yellow-600" />
          <div className="w-6 h-6 bg-yellow-700" />
          <div className="w-6 h-6 bg-yellow-800" />
        </div>
      </Card>
      <Card>
        <div style={{ zIndex: "10" }}>
          <h1 className="text-black">ReportGPT</h1>
          <p className="text-black">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus
            quasi molestiae debitis earum porro ipsum quaerat, ea necessitatibus
            atque reprehenderit neque, repellat sed in possimus quisquam, iure
            nostrum perspiciatis.
          </p>
          <div className="w-6 h-6 bg-yellow-300" />
          <div className="w-6 h-6 bg-yellow-400" />
          <div className="w-6 h-6 bg-yellow-500" />
          <div className="w-6 h-6 bg-yellow-600" />
          <div className="w-6 h-6 bg-yellow-700" />
          <div className="w-6 h-6 bg-yellow-800" />
        </div>
      </Card>
    </TikTokCarousel>
  );
}
