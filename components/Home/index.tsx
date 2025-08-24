import InnerContainer from "../ui/InnerContainer";
import OuterContainer from "../ui/OuterContainer";
import Section from "../ui/Section";

export default function Home() {
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