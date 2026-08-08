import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import SectionFallback from "@/components/SectionFallback";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import LanguagesSection from "@/components/LanguagesSection";
import { useSectionVisibility } from "@/hooks/useSections";

const PricingSection = lazyWithRetry(() => import("@/components/PricingSection"));
const TeachersSection = lazyWithRetry(() => import("@/components/TeachersSection"));
const ReviewsSection = lazyWithRetry(() => import("@/components/ReviewsSection"));
const SeoSection = lazyWithRetry(() => import("@/components/SeoSection"));
const FaqSection = lazyWithRetry(() => import("@/components/FaqSection"));
const BookingSection = lazyWithRetry(() => import("@/components/BookingSection"));
const ContactsSection = lazyWithRetry(() => import("@/components/ContactsSection"));
const Footer = lazyWithRetry(() => import("@/components/Footer"));
const CookieBanner = lazyWithRetry(() => import("@/components/CookieBanner"));

const Index = () => {
  const { isVisible } = useSectionVisibility();

  return (
    <div className="min-h-screen">
      <Header />
      {isVisible("hero") && <HeroSection />}
      {isVisible("about") && <AboutSection />}
      {isVisible("languages") && <LanguagesSection />}
      <Suspense fallback={<SectionFallback cards={3} tall />}>
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
