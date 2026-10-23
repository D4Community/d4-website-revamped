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
import { getCommunityPartners, getPartners } from "@/features/partners/queries";

export const HomePage = async () => {
  const [partners, communityPartners] = await Promise.all([
    getPartners(),
    getCommunityPartners(),
  ]);

  return (
    <main className="flex flex-col min-h-screen">
      <FAQSchema page={["join-faq", "faq"]} />
      <HeroSection />
      <FeatureSection />
      <CommunityPartners partners={communityPartners} />
      <Partners partners={partners} />
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
