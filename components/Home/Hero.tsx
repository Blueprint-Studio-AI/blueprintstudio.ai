import Section from "@/components/ui/Section";
import OuterContainer from "@/components//ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";

export default function Hero() {
    return (
        <Section>
            <OuterContainer>
                <InnerContainer>
                    <h1>Hello world</h1>
                    <h1>Hello world</h1>
                    <h1>Hello world</h1>
                    <h1>Hello world</h1>
                </InnerContainer>
            </OuterContainer>
            <div className="line-dash-x"/>
        </Section>
    )
}