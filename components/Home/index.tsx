import { Footer } from "@/components/Footer/index";
import InnerContainer from "../ui/InnerContainer";
import OuterContainer from "../ui/OuterContainer";
import Section from "../ui/Section";
import HeroA from "./Hero-a";
import QuoteSection from "./QuoteSection";
import Achievements from "./Achievements";
import PortfolioBento from "./PortfolioBento";
import PricingSection from "./PricingSection";
import TestimonialSection from "./TestimonialSection";
import FAQSection from "./FAQSection";

export default function Home() {
    return (
        <div>
            <QuoteSection/>
            <HeroA/>
            {/* Spacer to create scroll space for revealing quote */}
            <div className="h-screen" />
            <div className="relative z-30">
            <Achievements/>
            <PortfolioBento/>
            <PricingSection/>
            <TestimonialSection/>
            <FAQSection/>
                <Footer />
            </div>
        </div>
    )
}