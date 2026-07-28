import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage";
import Header from "@/components/Header";
import CityHero from "@/components/CityHero";
import AboutSectionOnline from "@/components/AboutSectionOnline";
import LanguagesSection from "@/components/LanguagesSection";
import { getCityBySlug } from "@/data/cities";
import { useMeta } from "@/hooks/useMeta";
import { useJsonLd } from "@/hooks/useJsonLd";

const PricingSection = lazy(() => import("@/components/PricingSection"));
const TeachersSection = lazy(() => import("@/components/TeachersSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const CityDiscountBanner = lazy(() => import("@/components/CityDiscountBanner"));
const CitySeoText = lazy(() => import("@/components/CitySeoText"));
const FaqSection = lazy(() => import("@/components/FaqSection"));
const BookingSection = lazy(() => import("@/components/BookingSection"));
const ContactsSection = lazy(() => import("@/components/ContactsSection"));
const Footer = lazy(() => import("@/components/Footer"));
const CookieBanner = lazy(() => import("@/components/CookieBanner"));

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
    canonical: "https://hispania35.online/",
  });

  const pageUrl = city ? `https://hispania35.online/${city.slug}` : "";

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
                { "@type": "ListItem", position: 1, name: "Главная", item: "https://hispania35.online/" },
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
      <Suspense fallback={null}>
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