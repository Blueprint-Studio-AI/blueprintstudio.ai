import { Footer } from "@/components/Footer/index";
import InnerContainer from "../ui/InnerContainer";
import OuterContainer from "../ui/OuterContainer";
import Section from "../ui/Section";
import Hero from "./Hero";
import QuoteSection from "./QuoteSection";

export default function Home() {
    return (
        <div>
            <QuoteSection/>
            <Hero/>
            {/* Spacer to create scroll space for revealing quote */}
            <div className="h-screen" />
            <div className="relative z-30">
                <Footer />
            </div>
        </div>
    )
}