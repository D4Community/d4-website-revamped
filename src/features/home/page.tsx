import { AboutSection, HeroSection } from "./sections";
import { EventCarousel } from "./sections/EventCarousel";
import FeatureSection from "./sections/FeatureSection";
import LogosSlider from "./sections/LogosSlider";
import { UpcomingEvents } from "./sections/UpcomingEvents";
import FAQPage from "./sections/FAQSection";
import { GallerySection } from "./sections/GallerySection";
import { CommunityPartners } from "./sections/CommunityPartners";
import { Partners } from "./sections/Partners";
import XReviews from "./sections/XReview";
import { FAQSchema } from "@/schema";

export const HomePage = () => {
  return (
    <main className="flex flex-col min-h-screen">
      <FAQSchema page={["join-faq", "faq"]} />
      <HeroSection />
      <FeatureSection />
      <CommunityPartners />
      <Partners />
      <div>
        <UpcomingEvents />
      </div>
      <div className="py-12">
        <EventCarousel />
      </div>
      <AboutSection />
      {/* <LogosSlider /> */}
      <XReviews />
      <GallerySection />
      <FAQPage />
    </main>
  );
};
