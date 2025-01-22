import React from 'react';
import TikTokCarousel from "../../template/TikTokCarousel";
import Card from "../../template/TikTokCarousel/Card";
import Image, { StaticImageData } from "next/image";
import FirstImage from "./images/FirstImage.jpg";
import { ProjectProps } from "../types";

interface CardContentProps {
  title: string;
  subtitle: string;
  mediaSrc: string | StaticImageData;
  mediaType: "image" | "video";
}

const CardContent: React.FC<CardContentProps> = ({ title, subtitle, mediaSrc, mediaType }) => (
  <div className="card-wrapper text-black my-0 mx-auto pt-[60px]">
    <div className="w-full h-full">
      {mediaType === "image" ? (
        <Image
          priority
          src={mediaSrc as StaticImageData}
          alt="Card image"
          className="w-full h-[60vh] py-[5%]"
        />
      ) : (
        <video
          controls
          className="w-full h-[60vh] py-[5%]"
        >
          <source src={mediaSrc as string} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <h1 className="font-[600] text-[21px]">{title}</h1>
      <h3 className="text-small">{subtitle}</h3>
    </div>
  </div>
);

export default function FirstSection({ isActive }: ProjectProps) {
  return (
    <TikTokCarousel isActive={isActive} isCarousel={true}>
      <Card>
        <CardContent
          title="Cona Cash1"
          subtitle="Brand built on action for a digital motivation technology."
          mediaSrc={FirstImage}
          mediaType="image"
        />
      </Card>
      {/* <Card> */}
        {/* <CardContent
          title="Cona Cash2"
          subtitle="Brand built on action for a digital motivation technology."
          mediaSrc="/videos/sample-video.mp4"
          mediaType="video"
        /> */}
      {/* </Card> */}
      <Card>
        <CardContent
          title="Cona Cash3"
          subtitle="Brand built on action for a digital motivation technology."
          mediaSrc={FirstImage}
          mediaType="image"
        />
      </Card>
    </TikTokCarousel>
  );
} 
