import React from 'react';
import TikTokCarousel from "../../template/TikTokCarousel";
import Card from "../../template/TikTokCarousel/Card";
import Image, { StaticImageData } from "next/image";
import FirstImage from "./images/FirstImage.png";
import { ProjectProps } from "../types";

interface CardContentProps {
  title: string;
  subtitle: string;
  imageSrc: string | StaticImageData;
}

const CardContent: React.FC<CardContentProps> = ({ title, subtitle, imageSrc }) => (
  <div className="card-wrapper text-black w-[90%] my-0 mx-auto">
    <div className="w-full h-full">
      <Image
        priority
        src={imageSrc}
        alt="Card image"
        className="w-full h-[75vh] py-[5%]"
      />
      <h1 className="font-[600] text-[21px]">{title}</h1>
      <h3 className="text-small">{subtitle}</h3>
    </div>
  </div>
);

export default function FirstSection({ isActive }: ProjectProps) {
  return (
    <TikTokCarousel isActive={isActive}>
      <Card>
        <CardContent
          title="Cona Cash1"
          subtitle="Brand built on action for a digital motivation technology."
          imageSrc={FirstImage} 
        />
      </Card>
      <Card>
        <CardContent
          title="Cona Cash2"
          subtitle="Brand built on action for a digital motivation technology."
          imageSrc={FirstImage} 
        />
      </Card>
      <Card>
        <CardContent
          title="Cona Cash3"
          subtitle="Brand built on action for a digital motivation technology."
          imageSrc={FirstImage}
        />
      </Card>
    </TikTokCarousel>
  );
}
