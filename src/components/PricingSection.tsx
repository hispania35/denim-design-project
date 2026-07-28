import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { usePricing } from "@/hooks/usePricing";

interface PricingSectionProps {
  currency?: "rub" | "byn";
}

const PricingSection = ({ currency = "rub" }: PricingSectionProps) => {
  const plans = usePricing();
  const byn = currency === "byn";
  const symbol = byn ? "Br" : "₽";
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Icon name="Tag" size={16} />
            Стоимость
          </div>
          <h2 className="font-heading font-800 text-4xl lg:text-5xl mb-4">
            Прозрачные <span className="gradient-text">цены</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Выберите подходящий формат — первый урок бесплатно
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`hover-lift relative rounded-3xl p-8 ${plan.gradient} border border-white/50`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6 px-4 py-1 gradient-primary text-white text-xs font-bold rounded-full">
                  Популярный
                </div>
              )}

              <h3 className="font-heading font-800 text-2xl mb-1">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                {(byn ? plan.oldPriceByn : plan.oldPrice) && (
                  <div className="text-muted-foreground text-sm line-through mb-1">
                    {byn ? plan.oldPriceByn : plan.oldPrice} {symbol}
                  </div>
                )}
                <span className="font-heading font-800 text-4xl">{byn ? plan.priceByn : plan.price} {symbol}</span>
                <span className="text-muted-foreground text-sm ml-1">/ {plan.unit}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <Icon name="Check" size={12} className="text-white" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full gradient-primary text-white border-0 font-heading font-semibold rounded-xl h-12"
                onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
              >
                {plan.cta}
                <Icon name="ArrowRight" size={18} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;