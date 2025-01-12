import { useState, useEffect, useRef } from "react";
import Implint from "./images/imprint.svg";
import Image from "next/image";
import NavLine from "./images/NavLine.svg";

interface LinkProps {
  href: string;
  text: string;
  className?: string;
}

// A reusable navigation item component
const NavItem: React.FC<LinkProps> = ({ href, text, className = "" }) => {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
    }
  }, [className]);

  return (
    <li className={`flex justify-between px-3 pt-2 pb-1 cursor-pointer ${className}`}>
      <a href={href}>{text}</a>
      <Image
        priority
        src={NavLine}
        alt="nav arrow"
        className="w-[16px]"
      />
    </li>
  );
};

export default function NavigationButton() {
    const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  
    const toggleNavbar = () => {
      setIsNavbarVisible(!isNavbarVisible);
    };
  
    return (
      <div className="flex flex-col w-40 mx-auto text-black fixed z-[1] inset-x-0 bottom-[8%]">

        <div
          className={`${
            isNavbarVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } transition-all shadow-[0px_0px_1px_0px_rgba(0,0,0,0.13)] duration-500 ease-in-out bg-[#E1E1E133] bg-white border border-[#F4F4F7B2] rounded-tl-[18px] and rounded-tr-[18px] navbar`}
        >
          <ul className="space-y-2">
            <NavItem href="/services" text="Services" />
            {/* TODO: update style and toggle logic and position */}
            <NavItem href="/about" text="About Us" />
          </ul>
        </div>
        <button
          onClick={toggleNavbar}
          className={`shadow-[0px_0px_1px_0px_rgba(0,0,0,0.13)] text-small bg-white border border-[#F4F4F7B2] p-[5px] flex items-center space-x-[10px] ${isNavbarVisible ? 'rounded-bl-[18px] and rounded-br-[18px]' : ' rounded-[18px]'}`}
        >
          <Image
            priority
            src={Implint}
            alt="Toggle Navbar"
            className="w-[32px]"
          />
          <span className="text-[#000] pr-[10px]">Start</span>
          <span className="text-[#1D1D1F8C] font-bold pr-[10px]">Learn</span>
        </button>
      </div>
    );
  }
  
