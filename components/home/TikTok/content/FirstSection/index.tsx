import React, { useState, useEffect } from 'react';
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

const CardContent: React.FC<CardContentProps> = ({ title, subtitle, mediaSrc, mediaType }) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);

    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <div className="card-wrapper text-black my-0 mx-auto pt-[60px]">
      <div
        style={{
          // position: "relative",
          // width: "100%",
          // aspectRatio: isDesktop ? "1 / 1.618" : "5 / 7", // TODO: think how make it better
          // overflow: "hidden",
        }}
        className="media-container w-full h-full"
      >
        {mediaType === "image" ? (
          <Image
            priority
            src={mediaSrc as StaticImageData}
            alt="Card image"
            // layout="fill"
            objectFit="cover"
            className="w-full h-[60vh] py-[5%]"
          />
        ) : (
          <video
            controls
            className="w-full h-[60vh] py-[5%]"
            style={{
              // position: "absolute",
              // width: "100%",
              // height: "100%",
              // objectFit: "cover",
            }}
          >
            <source src={mediaSrc as string} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <h1 className="font-[600] text-[21px] mt-4">{title}</h1>
      <h3>{subtitle}</h3>
    </div>
  );
};

const FirstSection: React.FC<ProjectProps> = ({ isActive }) => {
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
};

export default FirstSection;
