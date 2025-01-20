import TikTokScrollSection from "../../template/TikTokScrollSection";
import { ProjectProps } from "../types";
import { Footer } from "@/service-pages/components/sections/Footer";

export default function FooterSection({ isActive }: ProjectProps) {
    return (
        <TikTokScrollSection isActive={isActive} >
            <Footer />
        </TikTokScrollSection>
    );
}
