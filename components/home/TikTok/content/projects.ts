import FirstSection from "./FirstSection";
import SecondSection from "./SecondSection";
import ThirdSection from "./ThirdSection";

// This could be generated at build time,
// but for now we can to manually insert them bc a lot easier

export const PROJECTS = {
    FirstSection,
    SecondSection,
    ThirdSection,
} as const;

export const PROJECT_NAMES = Object.keys(PROJECTS);