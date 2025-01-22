import HeroSection from "./HeroSection";
import FirstSection from "./FirstSection";
import SecondSection from "./SecondSection";
import ThirdSection from "./ThirdSection";
import FooterSection from "./FooterSection";
import { useViewport } from "@/utils/hooks/useViewport";

export const PROJECTS = {
    HeroSection,
    FirstSection,
    SecondSection,
    ThirdSection,
    FooterSection,
} as const;

export const PROJECTS_MOBILE = {
    HeroSection,
    FirstSection,
    ThirdSection, 
} as const;

export const useProjectNames = () => {
    const { width: viewportWidth } = useViewport();
    return viewportWidth < 1024 ? Object.keys(PROJECTS_MOBILE) : Object.keys(PROJECTS);
};