import { ProjectProps } from "../types";
import { Footer } from "@/service-pages/components/sections/Footer";
import React from 'react';

export default function FooterSection({ isActive }: ProjectProps) {
    return (
        <div className="text-black h-[100%]">
            <Footer />
        </div>
    );
}
