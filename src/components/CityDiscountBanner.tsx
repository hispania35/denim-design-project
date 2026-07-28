import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { CityData } from "@/data/cities";

interface CityDiscountBannerProps {
  city: CityData;
}

const CityDiscountBanner = ({ city }: CityDiscountBannerProps) => {
  const openDiscount = () => {
    window.dispatchEvent(new Event("open-discount"));
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl gradient-card-orange border border-white/50 px-6 py-12 md:px-12 md:py-14 shadow-sm animate-float-soft">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-orange-200/30 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-orange-300/20 blur-2xl" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
                <Icon name="Gift" size={16} />
                Скидка для жителей {city.nameGenitive}
              </div>
              <h2 className="font-heading font-800 text-3xl md:text-4xl mb-3">
                Промокод на скидку за подписку
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Подпишитесь на нашу группу ВКонтакте и получите персональный промокод
                на скидку прямо на почту. Подходит для онлайн-обучения {city.nameIn}.
              </p>
            </div>

            <Button
              size="lg"
              onClick={openDiscount}
              className="gradient-primary text-white border-0 font-heading font-semibold text-base px-8 h-14 rounded-xl shrink-0 shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform"
            >
              Получить промокод
              <Icon name="ArrowRight" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityDiscountBanner;