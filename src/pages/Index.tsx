import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import LanguagesSection from "@/components/LanguagesSection";
import { useSectionVisibility } from "@/hooks/useSections";

const PricingSection = lazy(() => import("@/components/PricingSection"));
const TeachersSection = lazy(() => import("@/components/TeachersSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const SeoSection = lazy(() => import("@/components/SeoSection"));
const FaqSection = lazy(() => import("@/components/FaqSection"));
const BookingSection = lazy(() => import("@/components/BookingSection"));
const ContactsSection = lazy(() => import("@/components/ContactsSection"));
const Footer = lazy(() => import("@/components/Footer"));
const CookieBanner = lazy(() => import("@/components/CookieBanner"));

const Index = () => {
  const { isVisible } = useSectionVisibility();

  return (
    <div className="min-h-screen">
      <Header />
      {isVisible("hero") && <HeroSection />}
      {isVisible("about") && <AboutSection />}
      {isVisible("languages") && <LanguagesSection />}
      <Suspense fallback={null}>
        {isVisible("pricing") && <PricingSection />}
        {isVisible("teachers") && <TeachersSection />}
        {isVisible("reviews") && <ReviewsSection />}
        {isVisible("seo") && <SeoSection />}
        {isVisible("faq") && <FaqSection />}
        {isVisible("booking") && <BookingSection />}
        {isVisible("contacts") && <ContactsSection />}
        <Footer />
        <CookieBanner />
      </Suspense>
    </div>
  );
};

export default Index;
