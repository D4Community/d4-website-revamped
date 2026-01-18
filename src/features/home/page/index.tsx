import { AboutSection, HeroSection } from "../sections";
import { EventCarousel } from "../sections/EventCarousel";
import FeatureSection from "../sections/FeatureSection";
import LogosSlider from "../sections/LogosSlider";


export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <LogosSlider />
      <AboutSection />
      <FeatureSection />
      <EventCarousel />
    </>
  );
};
