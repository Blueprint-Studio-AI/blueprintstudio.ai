import { ProjectProps } from "../types";
import Implint from "./images/imprint.svg";
import Image from "next/image";
import NavigationButton from "./NavigationButton";

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
        <NavigationButton />
      </div>
    </div>
  );
}
