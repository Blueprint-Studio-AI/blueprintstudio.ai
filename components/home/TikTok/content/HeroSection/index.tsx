import { ProjectProps } from "../types";
import Implint from "./images/imprint.svg";
import Image from 'next/image';

export default function HeroSection({ isActive }: ProjectProps) {
    return (
        <div className="text-black">
            <div className="hero-wrapper w-80 my-0 mx-auto">
            <h1 className="text-center text-5xl font-base">Design <br></br> & Build</h1>
            <h3 className="font-small text-center pt-6">We partner with founders to shape their future.</h3>
            <button>
            <Image
                priority
                src={Implint}
                alt="Follow us on Twitter"
                />
                <span>Start</span>
                <span>Learn</span>
            </button>
            </div>
        </div>
    );
}