import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import SectionFallback from "@/components/SectionFallback";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import { useMeta } from "@/hooks/useMeta";
import { useJsonLd } from "@/hooks/useJsonLd";

const BookingSection = lazyWithRetry(() => import("@/components/BookingSection"));
const ReviewsSection = lazyWithRetry(() => import("@/components/ReviewsSection"));
const ContactsSection = lazyWithRetry(() => import("@/components/ContactsSection"));
const Footer = lazyWithRetry(() => import("@/components/Footer"));
const CookieBanner = lazyWithRetry(() => import("@/components/CookieBanner"));

const PAGE_URL = "https://hispania35.ru/native";
const VIDEO_URL =
  "https://cdn.poehali.dev/projects/a8294440-d983-4c3b-a5e7-85b5d812d683/bucket/ad233464-8aeb-489d-9276-4657b049ab5d.mp4";

const benefits = [
  {
    icon: "Mic",
    title: "Живое произношение",
    text: "Слышите настоящую испанскую речь с первого занятия и привыкаете к темпу носителя.",
  },
  {
    icon: "MessagesSquare",
    title: "Разговор с первого урока",
    text: "Никакой зубрёжки правил в тишине — вы говорите, а преподаватель мягко поправляет.",
  },
  {
    icon: "Users",
    title: "Мини-группы до 5 человек",
    text: "Каждому хватает времени на речь, а живой диалог с одногруппниками снимает страх ошибки.",
  },
  {
    icon: "Globe",
    title: "Культура изнутри",
    text: "Идиомы, юмор, привычки Испании и Латинской Америки — то, чего нет в учебниках.",
  },
];

const steps = [
  { num: "01", title: "Оставляете заявку", text: "Заполните форму — ответим в течение 30 минут." },
  { num: "02", title: "Бесплатный урок", text: "Знакомимся с преподавателем." },
  { num: "03", title: "Начинаете говорить", text: "Подбираем группу или индивидуальный формат." },
];

const NativeSpanish = () => {
  useMeta({
    title: "Испанский с носителем языка — приглашение на обучение | Hispania",
    description:
      "Занятия испанским с носителем языка онлайн и в группе. Живое произношение, разговорная практика с первого урока, мини-группы до 5 человек. Первое занятие бесплатно.",
    canonical: PAGE_URL,
  });

  useJsonLd("native-spanish", {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        name: "Испанский язык с носителем",
        description:
          "Занятия испанским языком с преподавателем-носителем: разговорная практика, произношение, мини-группы до 5 человек.",
        provider: {
          "@type": "EducationalOrganization",
          name: "Языковая студия Hispania",
          url: "https://hispania35.ru/",
        },
        hasCourseInstance: [
          {
            "@type": "CourseInstance",
            name: "Групповые занятия с носителем",
            courseMode: "blended",
            courseWorkload: "PT1H30M",
          },
        ],
      },
      {
        "@type": "VideoObject",
        name: "Урок испанского с носителем языка в группе",
        description:
          "Как проходит групповое занятие испанским языком с преподавателем-носителем в студии Hispania.",
        thumbnailUrl: "https://hispania35.ru/native-lesson-poster.jpg",
        contentUrl: VIDEO_URL,
        uploadDate: "2026-08-08",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: "https://hispania35.ru/" },
          { "@type": "ListItem", position: 2, name: "Испанский с носителем", item: PAGE_URL },
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 rounded-full gradient-primary opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-72 h-72 md:w-96 md:h-96 rounded-full gradient-primary opacity-10 blur-3xl" />

        <div className="container relative px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="animate-fade-up text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Icon name="Sparkles" size={16} />
                Приглашение на обучение
              </span>

              <h1 className="mt-6 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Испанский <span className="gradient-text">с носителем языка</span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                Загляните на настоящее занятие: живая речь, смех и разговор с первой минуты.
                Приходите на бесплатный урок и почувствуйте Испанию рядом.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="gradient-primary text-white border-0 hover-lift text-base h-14 px-8"
                  onClick={() =>
                    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Icon name="CalendarCheck" size={20} className="mr-2" />
                  Записаться бесплатно
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base border-2"
                  onClick={() =>
                    document.getElementById("video")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Icon name="Play" size={20} className="mr-2" />
                  Посмотреть урок
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 justify-center lg:justify-start">
                {[
                  { value: "5", label: "человек в группе" },
                  { value: "100%", label: "живая практика" },
                  { value: "0 ₽", label: "первый урок" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-heading text-3xl font-bold gradient-text">{s.value}</div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div id="video" className="animate-fade-up-delay-1 flex justify-center scroll-mt-24">
              <div className="relative w-full max-w-[320px] sm:max-w-[360px]">
                <div className="absolute -inset-3 gradient-primary rounded-[2.5rem] opacity-25 blur-2xl" />
                <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-black">
                  <video
                    className="w-full h-auto block aspect-[9/16] object-cover"
                    src={VIDEO_URL}
                    poster="/native-lesson-poster.jpg"
                    controls
                    playsInline
                    preload="metadata"
                  />
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Как проходит занятие в группе с носителем
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Почему именно <span className="gradient-text">с носителем</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Вы учите не «школьный», а настоящий разговорный испанский — такой, каким на нём
              говорят каждый день.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-card rounded-2xl p-6 shadow-sm hover-lift border border-border/50"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white">
                  <Icon name={b.icon} size={24} />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center">
            Как начать <span className="gradient-text">за 3 шага</span>
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.map((s) => (
              <div key={s.num} className="relative bg-card rounded-2xl p-8 border border-border/50 hover-lift">
                <div className="font-heading text-5xl font-bold gradient-text opacity-60">{s.num}</div>
                <h3 className="mt-4 font-heading text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="gradient-primary text-white border-0 hover-lift text-base h-14 px-10"
              onClick={() =>
                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Хочу на бесплатный урок
            </Button>
          </div>
        </div>
      </section>

      <Suspense fallback={<SectionFallback cards={3} />}>
        <ReviewsSection />
        <div id="booking" className="scroll-mt-20">
          <BookingSection />
        </div>
        <ContactsSection />
        <Footer />
        <CookieBanner />
      </Suspense>
    </div>
  );
};

export default NativeSpanish;