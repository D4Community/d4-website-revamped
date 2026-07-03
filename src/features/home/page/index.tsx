import { AboutSection, HeroSection } from "../sections";
import { EventCarousel } from "../sections/EventCarousel";
import FeatureSection from "../sections/FeatureSection";
import LogosSlider from "../sections/LogosSlider";
import FAQPage from "../sections/FAQSection";
import { UpcomingEvents } from "../sections/UpcomingEvents";
import { GallerySection } from "../sections/GallerySection";
import { Partners } from "../sections/Partners";
import OrgSchema from "@/schema/org-schema";
import { FAQSchema } from "@/schema";

export const HomePage = () => {
  return (
    <>
      <OrgSchema />
      <FAQSchema page={["join-faq", "faq"]} />
      <main className="flex flex-col min-h-screen">
        <HeroSection />
        <div>
          <EventCarousel />
        </div>
        <Partners />
        <UpcomingEvents />
        <AboutSection />
        <FeatureSection />
        <LogosSlider />
        <GallerySection />
        <FAQPage />
      </main>
    </>
  );
};
