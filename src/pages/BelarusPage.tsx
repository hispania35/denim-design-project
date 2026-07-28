import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import AboutSectionOnline from "@/components/AboutSectionOnline";
import LanguagesSection from "@/components/LanguagesSection";
import { belarusCities } from "@/data/cities";
import { useMeta } from "@/hooks/useMeta";
import { useJsonLd } from "@/hooks/useJsonLd";

const PricingSection = lazy(() => import("@/components/PricingSection"));
const TeachersSection = lazy(() => import("@/components/TeachersSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const FaqSection = lazy(() => import("@/components/FaqSection"));
const BookingSection = lazy(() => import("@/components/BookingSection"));
const ContactsSection = lazy(() => import("@/components/ContactsSection"));
const Footer = lazy(() => import("@/components/Footer"));
const CookieBanner = lazy(() => import("@/components/CookieBanner"));

const PAGE_URL = "https://hispania35.online/belarus";

const BelarusPage = () => {
  useMeta({
    title: "Курсы испанского, немецкого, английского в Беларуси онлайн | Hispania",
    description:
      "Онлайн-курсы иностранных языков в Беларуси: испанский, немецкий, английский для жителей Минска, Гомеля, Бреста и других городов. Мини-группы и индивидуальные занятия, первое занятие бесплатно.",
    canonical: "https://hispania35.online/",
  });

  useJsonLd("belarus", {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${PAGE_URL}#org`,
        name: "Языковая студия Hispania",
        url: PAGE_URL,
        description:
          "Онлайн-курсы испанского, немецкого и английского языка для жителей Беларуси.",
        email: "hispania35@yandex.ru",
        telephone: "+79211238221",
        areaServed: { "@type": "Country", name: "Беларусь" },
        sameAs: ["https://vk.com/club119672828"],
      },
      {
        "@type": "Course",
        name: "Курсы иностранных языков в Беларуси онлайн",
        description:
          "Испанский, немецкий и английский язык онлайн для жителей Беларуси. Мини-группы до 6 человек и индивидуальные занятия.",
        provider: { "@id": `${PAGE_URL}#org` },
        hasCourseInstance: [
          {
            "@type": "CourseInstance",
            name: "Индивидуальные занятия один на один",
            courseMode: "online",
            courseWorkload: "PT1H",
          },
          {
            "@type": "CourseInstance",
            name: "Групповые занятия в мини-группах",
            courseMode: "online",
            courseWorkload: "PT2H",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: "https://hispania35.online/" },
          { "@type": "ListItem", position: 2, name: "Беларусь", item: PAGE_URL },
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen">
      <Header />

      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-orange-50" />
        <div className="absolute top-32 right-10 w-72 h-72 rounded-full bg-purple-200/30 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-orange-200/20 blur-3xl animate-float-delay" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <a
                href="#booking"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6 animate-fade-up hover:bg-purple-200 transition-colors cursor-pointer"
              >
                <Icon name="MapPin" size={16} />
                Онлайн-обучение в Беларуси
              </a>

              <h1 className="font-heading font-900 text-4xl lg:text-6xl leading-tight mb-6 animate-fade-up">
                Курсы языков <span className="gradient-text">в Беларуси</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-md mb-8 animate-fade-up-delay-1">
                Английский, немецкий и испанский для жителей Беларуси — онлайн из дома,
                индивидуально и в мини-группах. Преподаём из России, занимаемся на русском языке.
                Первое занятие бесплатно.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-2">
                <Button
                  size="lg"
                  className="gradient-primary text-white border-0 font-heading font-semibold text-base px-8 h-14 rounded-xl"
                  onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Записаться на пробное
                  <Icon name="ArrowRight" size={20} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-heading font-semibold text-base px-8 h-14 rounded-xl"
                  onClick={() => document.getElementById("cities")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Выбрать город
                </Button>
              </div>

              <div className="flex items-center gap-8 mt-10 animate-fade-up-delay-3">
                <div>
                  <div className="font-heading font-800 text-3xl gradient-text">500+</div>
                  <div className="text-sm text-muted-foreground">учеников</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <div className="font-heading font-800 text-3xl gradient-text">15 лет</div>
                  <div className="text-sm text-muted-foreground">опыта</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://cdn.poehali.dev/projects/c066c37a-f840-40ae-bf25-35290452380d/files/803028f6-6301-487d-bdfa-c9513189e123.jpg"
                  alt="Ученики языковой студии Hispania из Беларуси изучают языки онлайн"
                  loading="eager"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
              </div>

              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white text-2xl">
                    🇬🇧
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm">English</div>
                    <div className="text-xs text-muted-foreground">A1 → B2</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 glass rounded-2xl p-4 shadow-lg animate-float-delay">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white text-2xl">
                    🇪🇸
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm">Español</div>
                    <div className="text-xs text-muted-foreground">A1 → B2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSectionOnline />
      <LanguagesSection />

      <section id="cities" className="py-24 bg-gradient-to-b from-white to-purple-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
              <Icon name="MapPin" size={16} />
              Города Беларуси
            </div>
            <h2 className="font-heading font-800 text-3xl lg:text-4xl mb-4">
              Учим языки онлайн по всей Беларуси
            </h2>
            <p className="text-muted-foreground text-lg">
              Выберите свой город — занятия проходят онлайн, из любой точки страны
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {belarusCities.map((city) => (
              <a
                key={city.slug}
                href={`/${city.slug}`}
                className="hover-lift group rounded-2xl p-5 bg-white border border-border/50 shadow-sm flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon name="MapPin" size={18} className="text-white" />
                </div>
                <span className="font-heading font-bold">{city.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-purple-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
              <Icon name="GraduationCap" size={16} />
              Беларусь
            </div>
            <h2 className="font-heading font-800 text-3xl lg:text-4xl mb-4">
              Изучение иностранных языков в Беларуси
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Языковая студия <span className="font-semibold text-foreground">Hispania</span> приглашает
              жителей Беларуси на онлайн-курсы испанского, немецкого и английского языка. Вы занимаетесь
              из дома в удобное время — формат полностью онлайн, поэтому учиться можно из Минска, Гомеля,
              Бреста или любого другого города страны.
            </p>
            <p>
              <span className="font-semibold text-foreground">Курсы испанского языка</span> подойдут и
              начинающим с нуля, и тем, кто готовится к экзамену DELE.
              <span className="font-semibold text-foreground"> Курсы немецкого</span> помогут подготовиться
              к Goethe-Zertifikat, поступлению или переезду.
              <span className="font-semibold text-foreground"> Курсы английского</span> — для работы,
              путешествий и свободного общения.
            </p>
            <p>
              Мы обучаем индивидуально и в мини-группах до 6 человек, поэтому каждый ученик из Беларуси
              получает максимум внимания преподавателя. Запишитесь на бесплатное пробное занятие —
              познакомитесь с преподавателем, определите свой уровень и убедитесь, что наш формат вам подходит.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <PricingSection currency="byn" />
        <TeachersSection />
        <ReviewsSection />
        <FaqSection />
        <BookingSection onlineOnly city="Беларусь" />
        <ContactsSection city="Беларусь" />
        <Footer />
        <CookieBanner />
      </Suspense>
    </div>
  );
};

export default BelarusPage;