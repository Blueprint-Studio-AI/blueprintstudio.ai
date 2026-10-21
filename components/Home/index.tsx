import { Footer } from "@/components/Footer/index";
import Hero from "./Hero";
import PortfolioBento from "./PortfolioBento";
import HowWeWork from "./HowWeWork";
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
                {/* #pricing kept for old links; the section itself is #how-we-work */}
                <div id="pricing">
                    <HowWeWork/>
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
