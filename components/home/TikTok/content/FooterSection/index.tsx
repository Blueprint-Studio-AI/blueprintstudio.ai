import { ProjectProps } from "../types";
import { Footer } from "@/service-pages/components/sections/Footer";

export default function FooterSection({ isActive }: ProjectProps) {
    return (
        <div className="text-black">
            <Footer />
        </div>
    );
}