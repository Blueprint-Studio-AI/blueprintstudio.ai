import { ProjectProps } from "../types";
import TikTokCarousel from "../../template/TikTokCarousel";
import Card from "../../template/TikTokCarousel/Card";

export default function IDScanner({ isActive }: ProjectProps) {
    return (
        <TikTokCarousel isActive={isActive}>
            <Card>
                <h1>SDN</h1>
            </Card>
            <Card>
                <h1>SDN2</h1>
            </Card>
            <Card>
                <h1>SDN3</h1>
            </Card>
        </TikTokCarousel>
    );
}