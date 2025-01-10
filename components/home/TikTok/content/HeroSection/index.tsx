import { ProjectProps } from "../types";
import Implint from "./images/imprint.svg";
import Image from "next/image";

export default function HeroSection({ isActive }: ProjectProps) {
  return (
    <div className="text-black pt-[16vh] h-full">
      <div className="hero-wrapper w-80 my-0 mx-auto h-full flex flex-col justify-around">
        <div>
        <h1 className="text-center text-8xl font-base">
          Design <br></br> & Build
        </h1>
        <h3 className="font-small text-2xl text-center pt-6">
          We partner with founders to shape their future.
        </h3>
        </div>
        <div className="w-full flex justify-center">
          <button className="text-small bg-[#E1E1E133] border border-[#F4F4F7B2] rounded-[32px] p-[2px] flex items-center space-x-[10px]">
            <Image priority src={Implint} alt="Follow us on Twitter" className="w-[32px]" />
            <span className="text-[#000] pr-[10px]">Start</span>
            <span className="text-[#1D1D1F8C] font-bold pr-[10px]">Learn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
