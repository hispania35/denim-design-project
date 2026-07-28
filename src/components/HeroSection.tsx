import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useContent } from "@/hooks/useContent";

const HeroSection = () => {
  const c = useContent("hero");
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-orange-50" />

      <div className="absolute top-32 right-10 w-72 h-72 rounded-full bg-purple-200/30 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-orange-200/20 blur-3xl animate-float-delay" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <a href="#booking" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6 animate-fade-up hover:bg-purple-200 transition-colors cursor-pointer">
              <Icon name="Sparkles" size={16} />
              {c.badge}
            </a>

            <h1 className="font-heading font-900 text-5xl lg:text-7xl leading-tight mb-6 animate-fade-up">
              {c.titleStart}{" "}<span className="gradient-text">{c.titleAccent}</span><br />{c.titleEnd}
            </h1>

            <p className="text-lg text-muted-foreground max-w-md mb-8 animate-fade-up-delay-1">
              {c.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-2">
              <Button
                size="lg"
                className="gradient-primary text-white border-0 font-heading font-semibold text-base px-8 h-14 rounded-xl"
                onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
              >
                {c.primaryBtn}
                <Icon name="ArrowRight" size={20} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-heading font-semibold text-base px-8 h-14 rounded-xl"
                onClick={() => document.getElementById("languages")?.scrollIntoView({ behavior: "smooth" })}
              >
                {c.secondaryBtn}
              </Button>
            </div>

            <div className="flex items-center gap-8 mt-10 animate-fade-up-delay-3">
              <div>
                <div className="font-heading font-800 text-3xl gradient-text">{c.stat1Value}</div>
                <div className="text-sm text-muted-foreground">{c.stat1Label}</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <div className="font-heading font-800 text-3xl gradient-text">{c.stat2Value}</div>
                <div className="text-sm text-muted-foreground">{c.stat2Label}</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={c.image}
                alt="Студенты языковой студии Hispania изучают испанский, немецкий и английский язык в Вологде"
                loading="eager"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
            </div>

            <a href="#languages" className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-lg animate-float hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white text-2xl">
                  🇬🇧
                </div>
                <div>
                  <div className="font-heading font-bold text-sm">English</div>
                  <div className="text-xs text-muted-foreground">A1 → B2</div>
                </div>
              </div>
            </a>

            <a href="#languages" className="absolute -top-4 -right-4 glass rounded-2xl p-4 shadow-lg animate-float-delay hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white text-2xl">
                  🇪🇸
                </div>
                <div>
                  <div className="font-heading font-bold text-sm">Español</div>
                  <div className="text-xs text-muted-foreground">A1 → B2</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;