import { Footer } from "@/components/Footer/index";
import Hero from "./Hero";
import Achievements from "./Achievements";
import PortfolioBento from "./PortfolioBento";
import PricingSection from "./PricingSection";
import TestimonialSection from "./TestimonialSection";
import FAQSection from "./FAQSection";
import ScheduleCallSection from "./ScheduleCallSection";
import ClientLogoTicker from "./ClientLogoTicker";
import AssetGeneratorBand from "./AssetGeneratorBand";

export default function Home() {
    return (
        <div>
            <div id="hero">
                <Hero/>
            </div>
            <div className="relative z-30">
                <div id="logos">
                    <ClientLogoTicker />
                </div>
                <div id="work">
                    <PortfolioBento/>
                </div>
                <Achievements/>
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
                <div id="asset-generator">
                    <AssetGeneratorBand />
                </div>
                <Footer />
            </div>
        </div>
    )
}
