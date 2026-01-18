import { AboutSection, HeroSection } from "../sections";
import FeatureSection from "../sections/FeatureSection";
import LogosSlider from "../sections/LogosSlider";


export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <LogosSlider />
      <AboutSection />
      <FeatureSection />
    </>
  );
};
