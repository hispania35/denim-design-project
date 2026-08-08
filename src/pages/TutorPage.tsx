import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import SectionFallback from "@/components/SectionFallback";
import { useLocation } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { getTutorBySlug, TUTOR_CITY } from "@/data/tutors";
import { useContent } from "@/hooks/useContent";
import { useMeta } from "@/hooks/useMeta";
import { useJsonLd } from "@/hooks/useJsonLd";

const PricingSection = lazyWithRetry(() => import("@/components/PricingSection"));
const TeachersSection = lazyWithRetry(() => import("@/components/TeachersSection"));
const ReviewsSection = lazyWithRetry(() => import("@/components/ReviewsSection"));
const BookingSection = lazyWithRetry(() => import("@/components/BookingSection"));
const ContactsSection = lazyWithRetry(() => import("@/components/ContactsSection"));
const Footer = lazyWithRetry(() => import("@/components/Footer"));
const CookieBanner = lazyWithRetry(() => import("@/components/CookieBanner"));

const TutorPage = () => {
  const { pathname } = useLocation();
  const tutor = getTutorBySlug(pathname.replace(/^\//, ""));
  const hero = useContent("hero");
  const pageUrl = tutor ? `https://hispania35.ru/${tutor.slug}` : "";

  useMeta({
    title: tutor?.title ?? "Hispania",
    description: tutor?.description ?? "",
    canonical: pageUrl,
  });

  useJsonLd(
    "tutor",
    tutor
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "EducationalOrganization",
              "@id": `${pageUrl}#org`,
              name: "Языковая студия Hispania",
              url: pageUrl,
              description: `Репетиторы ${tutor.langGenitive} в Вологде: индивидуальные занятия и мини-группы, очно и онлайн.`,
              email: "hispania35@yandex.ru",
              telephone: "+79211238221",
              areaServed: { "@type": "City", name: "Вологда" },
              sameAs: ["https://vk.com/club119672828"],
            },
            {
              "@type": "Service",
              name: `Репетитор ${tutor.langGenitive} в Вологде`,
              serviceType: "Репетиторство",
              description: tutor.description,
              provider: { "@id": `${pageUrl}#org` },
              areaServed: { "@type": "City", name: "Вологда" },
            },
            {
              "@type": "FAQPage",
              mainEntity: tutor.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Главная", item: "https://hispania35.ru/" },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: `Репетитор ${tutor.langGenitive} в Вологде`,
                  item: pageUrl,
                },
              ],
            },
          ],
        }
      : null,
  );

  if (!tutor) return <NotFoundPage />;

  const scrollToBooking = () =>
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 rounded-full gradient-primary opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-72 h-72 md:w-96 md:h-96 rounded-full gradient-primary opacity-10 blur-3xl" />

        <div className="container relative px-4 mx-auto text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span>{tutor.emoji}</span>
            Языковая студия Hispania · {TUTOR_CITY}
          </span>

          <h1 className="mt-6 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Репетитор {tutor.langGenitive} <span className="gradient-text">в Вологде</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            {tutor.heroText}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gradient-primary text-white border-0 hover-lift text-base h-14 px-8"
              onClick={scrollToBooking}
            >
              <Icon name="CalendarCheck" size={20} className="mr-2" />
              Записаться на бесплатный урок
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base border-2"
              onClick={() =>
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Узнать стоимость
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 justify-center">
            {[
              { value: hero.stat2Value, label: `${hero.stat2Label} студии` },
              { value: "до 5", label: "человек в группе" },
              { value: "0 ₽", label: "первый урок" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-heading text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Как занимается <span className="gradient-text">наш репетитор</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Никаких скучных учебников от корки до корки — только то, что действительно приближает
              вас к цели.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutor.benefits.map((b) => (
              <div
                key={b.title}
                className="bg-card rounded-2xl p-6 shadow-sm hover-lift border border-border/50"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white">
                  <Icon name={b.icon} size={24} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Кому подойдут <span className="gradient-text">занятия</span>
            </h2>
            <ul className="mt-8 space-y-4">
              {tutor.audience.map((a) => (
                <li key={a} className="flex gap-3">
                  <Icon name="CircleCheck" size={22} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Частые вопросы</h2>
            <div className="mt-6 space-y-6">
              {tutor.faq.map((f) => (
                <div key={f.q}>
                  <h3 className="font-heading font-bold">{f.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<SectionFallback cards={3} tall />}>
        <PricingSection />
        <TeachersSection />
        <ReviewsSection />

        <section className="py-16 md:py-24 bg-muted/40">
          <div className="container px-4 mx-auto max-w-3xl space-y-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">
              Репетитор {tutor.langGenitive} в Вологде — студия Hispania
            </h2>
            {tutor.seo.map((p) => (
              <p key={p.slice(0, 24)} className="text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>

        <BookingSection city="Вологда" />
        <ContactsSection city="Вологда" />
        <Footer />
        <CookieBanner />
      </Suspense>
    </div>
  );
};

export default TutorPage;