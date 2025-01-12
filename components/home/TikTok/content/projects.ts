import HeroSection from "./HeroSection";
import FirstSection from "./FirstSection";
import SecondSection from "./SecondSection";
import ThirdSection from "./ThirdSection";
import FooterSection from "./FooterSection";

// This could be generated at build time,
// but for now we can to manually insert them bc a lot easier

export const PROJECTS = {
    HeroSection,  
    FirstSection,
    SecondSection,
    ThirdSection,
    FooterSection,
} as const;

export const PROJECT_NAMES = Object.keys(PROJECTS);