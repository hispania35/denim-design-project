import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { CityData } from "@/data/cities";

interface CityHeroProps {
  city: CityData;
}

const CityHero = ({ city }: CityHeroProps) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-orange-50" />

      <div className="absolute top-32 right-10 w-72 h-72 rounded-full bg-purple-200/30 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-orange-200/20 blur-3xl animate-float-delay" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <a href="#booking" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6 animate-fade-up hover:bg-purple-200 transition-colors cursor-pointer">
              <Icon name="MapPin" size={16} />
              Онлайн-обучение {city.nameIn}
            </a>

            <h1 className="font-heading font-900 text-4xl lg:text-6xl leading-tight mb-6 animate-fade-up">
              Курсы языков{" "}<span className="gradient-text">{city.nameIn}</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md mb-8 animate-fade-up-delay-1">
              Английский, немецкий и испанский для жителей {city.nameGenitive} —
              онлайн из дома, в мини-группах и индивидуально. Первое занятие бесплатно.
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
                onClick={() => document.getElementById("languages")?.scrollIntoView({ behavior: "smooth" })}
              >
                Узнать больше
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
                alt={`Ученики языковой студии Hispania из ${city.nameGenitive} изучают языки онлайн`}
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
  );
};

export default CityHero;
