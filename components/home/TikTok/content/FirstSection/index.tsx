import React from 'react';
import TikTokCarousel from "../../template/TikTokCarousel";
import TikTokCardContent from "../../template/TikTokCardContent";
import Card from "../../template/TikTokCarousel/Card";
import FirstImage from "./images/FirstImage.jpg";
import { ProjectProps } from "../types";


const FirstSection: React.FC<ProjectProps> = ({ isActive }) => {
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
          title="Cona Cash2"
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
      <Card>
        <TikTokCardContent
          title="Cona Cash4"
          subtitle="Brand built on action for a digital motivation technology."
          mediaSrc={FirstImage}
          mediaType="image"
        />
      </Card>
      <Card>
        <TikTokCardContent
          title="Cona Cash5"
          subtitle="Brand built on action for a digital motivation technology."
          mediaSrc={FirstImage}
          mediaType="image"
        />
      </Card>
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
          title="Cona Cash2"
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
      <Card>
        <TikTokCardContent
          title="Cona Cash4"
          subtitle="Brand built on action for a digital motivation technology."
          mediaSrc={FirstImage}
          mediaType="image"
        />
      </Card>
      <Card>
        <TikTokCardContent
          title="Cona Cash5"
          subtitle="Brand built on action for a digital motivation technology."
          mediaSrc={FirstImage}
          mediaType="image"
        />
      </Card>
    </TikTokCarousel>
  );
};

export default FirstSection;
