import { AboutSection, HeroSection } from "./sections";
import { EventCarousel } from "./sections/EventCarousel";
import FeatureSection from "./sections/FeatureSection";
import { UpcomingEvents } from "./sections/UpcomingEvents";
import FAQPage from "./sections/FAQSection";
import { GallerySection } from "./sections/GallerySection";
import { CommunityPartners } from "./sections/CommunityPartners";
import { Partners } from "./sections/Partners";
import XReviews from "./sections/XReview";
import { FAQSchema } from "@/schema";
import { getCommunityPartners, getPartners } from "@/features/partners/queries";
import { getGalleryImages } from "@/features/gallery/queries";
import { getPastEvents, getUpcomingEvents } from "@/features/events/data";
import { getReviewTweets } from "@/features/reviews/tweets";

export const HomePage = async () => {
  const [partners, communityPartners, galleryImages, upcoming, past, tweets] = await Promise.all([
    getPartners(),
    getCommunityPartners(),
    getGalleryImages(18),
    getUpcomingEvents(),
    getPastEvents(),
    getReviewTweets(),
  ]);

  return (
    <main className="flex flex-col min-h-screen">
      <FAQSchema page={["join-faq", "faq"]} />
      <HeroSection />
      <FeatureSection />
      <CommunityPartners partners={communityPartners} />
      <Partners partners={partners} />
      <div>
        <UpcomingEvents events={upcoming} />
      </div>
      <div className="py-12">
        <EventCarousel events={past} />
      </div>
      <AboutSection />
      {/* <LogosSlider /> */}
      <XReviews tweets={tweets} />
      <GallerySection images={galleryImages} />
      <FAQPage />
    </main>
  );
};
