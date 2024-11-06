import TikTokCarousel from "../../template/TikTokCarousel";
import Card from "../../template/TikTokCarousel/Card";
import { ProjectProps } from "../types";

export default function IDScanner({ isActive }: ProjectProps) {
    return (
        <TikTokCarousel isActive={isActive}>
            <Card>
                <div className="bg-blue-200 w-full h-full">
                    <h1>IDScanner.com</h1>
                </div>
            </Card>
            <Card>
                <div className="bg-blue-200">
                    <h1>IDScanner.com</h1>
                    <p>I love IDScanners!</p>
                    <div className="h-80 w-80 bg-red-200">
                        <h1 className="font-mono">me too lmao</h1>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="bg-blue-200">
                    <h1>IDScanner.com</h1>
                    <p>I love IDScanners!</p>
                    <div className="h-80 w-80 bg-red-200">
                        <h1 className="font-mono">me too lmao</h1>
                    </div>
                </div>
            </Card>
        </TikTokCarousel>
    );
}