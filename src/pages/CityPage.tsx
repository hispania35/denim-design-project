import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import SectionFallback from "@/components/SectionFallback";
import { useLocation } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage";
import Header from "@/components/Header";
import CityHero from "@/components/CityHero";
import AboutSectionOnline from "@/components/AboutSectionOnline";
import LanguagesSection from "@/components/LanguagesSection";
import { getCityBySlug } from "@/data/cities";
import { useMeta } from "@/hooks/useMeta";
import { useJsonLd } from "@/hooks/useJsonLd";

const PricingSection = lazyWithRetry(() => import("@/components/PricingSection"));
const TeachersSection = lazyWithRetry(() => import("@/components/TeachersSection"));
const ReviewsSection = lazyWithRetry(() => import("@/components/ReviewsSection"));
const CityDiscountBanner = lazyWithRetry(() => import("@/components/CityDiscountBanner"));
const CitySeoText = lazyWithRetry(() => import("@/components/CitySeoText"));
const FaqSection = lazyWithRetry(() => import("@/components/FaqSection"));
const BookingSection = lazyWithRetry(() => import("@/components/BookingSection"));
const ContactsSection = lazyWithRetry(() => import("@/components/ContactsSection"));
const Footer = lazyWithRetry(() => import("@/components/Footer"));
const CookieBanner = lazyWithRetry(() => import("@/components/CookieBanner"));

const CityPage = () => {
  const { pathname } = useLocation();
  const citySlug = pathname.replace(/^\//, "");
  const city = getCityBySlug(citySlug);

  useMeta({
    title: city
      ? `Курсы испанского, немецкого, английского ${city.nameIn} онлайн | Hispania`
      : "Hispania",
    description: city
      ? `Курсы иностранных языков ${city.nameIn} онлайн: испанский, немецкий, английский. Мини-группы до 6 человек и индивидуальные занятия, опытные преподаватели, первое занятие бесплатно.`
      : "",
    canonical: "https://hispania35.ru/",
  });

  const pageUrl = city ? `https://hispania35.ru/${city.slug}` : "";

  useJsonLd(
    "city",
    city
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "EducationalOrganization",
              "@id": `${pageUrl}#org`,
              name: "Языковая студия Hispania",
              url: pageUrl,
              description: `Онлайн-курсы испанского, немецкого и английского языка для жителей ${city.nameGenitive}.`,
              email: "hispania35@yandex.ru",
              telephone: "+79211238221",
              areaServed: { "@type": "City", name: city.name },
              sameAs: ["https://vk.com/club119672828"],
            },
            {
              "@type": "Course",
              name: `Курсы иностранных языков ${city.nameIn} онлайн`,
              description: `Испанский, немецкий и английский язык онлайн для жителей ${city.nameGenitive}. Мини-группы до 6 человек и индивидуальные занятия.`,
              provider: { "@id": `${pageUrl}#org` },
              hasCourseInstance: [
                {
                  "@type": "CourseInstance",
                  name: "Групповые занятия в мини-группах",
                  courseMode: "online",
                  courseWorkload: "PT2H",
                },
                {
                  "@type": "CourseInstance",
                  name: "Индивидуальные занятия один на один",
                  courseMode: "online",
                  courseWorkload: "PT1H",
                },
              ],
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Главная", item: "https://hispania35.ru/" },
                { "@type": "ListItem", position: 2, name: city.name, item: pageUrl },
              ],
            },
          ],
        }
      : null,
  );

  if (!city) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <CityHero city={city} />
      <AboutSectionOnline />
      <LanguagesSection />
      <Suspense fallback={<SectionFallback cards={3} tall />}>
        <PricingSection currency={city.country === "by" ? "byn" : "rub"} />
        <TeachersSection />
        <ReviewsSection />
        <CityDiscountBanner city={city} />
        <CitySeoText city={city} />
        <FaqSection />
        <BookingSection onlineOnly city={city.name} />
        <ContactsSection city={city.name} />
        <Footer />
        <CookieBanner />
      </Suspense>
    </div>
  );
};

export default CityPage;