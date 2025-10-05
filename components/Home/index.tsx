import { Footer } from "@/components/Footer/index";
import InnerContainer from "../ui/InnerContainer";
import OuterContainer from "../ui/OuterContainer";
import Section from "../ui/Section";
// import Hero from "./Hero";
// import HeroA from "./Hero-a";
import HeroB from "./Hero-b";
import QuoteSection from "./QuoteSection";
import Achievements from "./Achievements";
import PortfolioBento from "./PortfolioBento";
import PricingSection from "./PricingSection";
import TestimonialSection from "./TestimonialSection";
import FAQSection from "./FAQSection";
import ScheduleCallSection from "./ScheduleCallSection";

export default function Home() {
    return (
        <div>
            <QuoteSection/>
            <HeroB/>
            {/* Spacer to create scroll space for revealing quote */}
            <div className="h-screen" />
            <div className="relative z-30">
            <Achievements/>
            <PortfolioBento/>
            <PricingSection/>
            <TestimonialSection/>
            <FAQSection/>
            <ScheduleCallSection/>
                <Footer />
            </div>
        </div>
    )
}