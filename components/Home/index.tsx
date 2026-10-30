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

// Each section's data-section names it for analytics (section_view, and the
// section of a click inside it); see docs/analytics/events.md.
export default function Home() {
    return (
        <div>
            <div id="hero" data-section="hero">
                <Hero/>
            </div>
            <div className="relative z-30">
                <div id="logos" data-section="logos">
                    <ClientLogoTicker />
                </div>
                <div id="work" data-section="work">
                    <PortfolioBento/>
                </div>
                <Achievements/>
                <div id="pricing" data-section="pricing">
                    <PricingSection/>
                </div>
                <div id="testimonials" data-section="testimonials">
                    <TestimonialSection/>
                </div>
                <div id="faq" data-section="faq">
                    <FAQSection/>
                </div>
                <div id="contact" data-section="booking">
                    <ScheduleCallSection/>
                </div>
                <div id="asset-generator" data-section="asset_generator">
                    <AssetGeneratorBand />
                </div>
                <Footer />
            </div>
        </div>
    )
}
