import { Footer } from "@/components/Footer/index";
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
            <div id="hero">
                <HeroB/>
            </div>
            <div id="about">
                <QuoteSection/>
            </div>
            {/* Spacer to create scroll space for revealing quote */}
            <div className="h-screen" />
            <div className="relative z-30">
                <Achievements/>
                <div id="work">
                    <PortfolioBento/>
                </div>
                <div id="pricing">
                    <PricingSection/>
                </div>
                <div id="testimonials">
                    <TestimonialSection/>
                </div>
                <div id="faq">
                    <FAQSection/>
                </div>
                <div id="contact">
                    <ScheduleCallSection/>
                </div>
                <Footer />
            </div>
        </div>
    )
}