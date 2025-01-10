import IDScanner from "./IDScanner";
import ReportGPT from "./ReportGPT";
import SDN from "./SDN";
import FooterSection from "./FooterSection";

// This could be generated at build time,
// but for now we can to manually insert them bc a lot easier

export const PROJECTS = {
    IDScanner,
    ReportGPT,
    SDN,
    FooterSection
} as const;

export const PROJECT_NAMES = Object.keys(PROJECTS);