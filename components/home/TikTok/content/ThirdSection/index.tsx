import React from 'react';
import TikTokCarousel from "../../template/TikTokCarousel";
import Card from "../../template/TikTokCarousel/Card";
import TikTokCardContent from "../../template/TikTokCardContent";
import FirstImage from "./images/FirstImage.jpg";
import { ProjectProps } from "../types";

const ThirdSection: React.FC<ProjectProps> = ({ isActive }) => {
  return (
    <TikTokCarousel isActive={isActive} isCarousel={true}>
      <Card>
        <TikTokCardContent
          title="Cona Cash1"
          subtitle="Brand built on action for a digital motivation technology."
          mediaSrc={FirstImage}
          mediaType="image"
        />
      </Card>
      <Card>
        <TikTokCardContent
          title="Cona Cash3"
          subtitle="Brand built on action for a digital motivation technology."
          mediaSrc={FirstImage}
          mediaType="image"
        />
      </Card>
    </TikTokCarousel>
  );
};

export default ThirdSection;
