export interface Plan {
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  priceByn: string;
  oldPriceByn?: string;
  unit: string;
  gradient: string;
  features: string[];
  popular: boolean;
  cta: string;
}

export const plans: Plan[] = [
  {
    name: "Старт",
    description: "Для тех, кто только начинает",
    price: "1 200",
    oldPrice: "1 500",
    priceByn: "45",
    oldPriceByn: "55",
    unit: "урок",
    gradient: "gradient-card-blue",
    features: [
      "Индивидуальные занятия",
      "40 минут продолжительность",
      "Домашние задания",
      "Чат с преподавателем",
    ],
    popular: false,
    cta: "Начать",
  },
  {
    name: "Стандарт",
    description: "Оптимальный темп прогресса",
    price: "2 200",
    priceByn: "80",
    unit: "урок",
    gradient: "gradient-card-purple",
    features: [
      "Индивидуальные занятия",
      "60 минут продолжительность",
      "Домашние задания",
      "Чат с преподавателем",
      "Разговорный клуб",
    ],
    popular: true,
    cta: "Выбрать",
  },
  {
    name: "Групповой",
    description: "От 3 человек — учиться веселее вместе",
    price: "800",
    priceByn: "30",
    unit: "урок",
    gradient: "gradient-card-orange",
    features: [
      "От 3 человек в группе",
      "45 минут продолжительность",
      "Домашние задания",
      "Чат с преподавателем",
      "Разговорный клуб",
    ],
    popular: false,
    cta: "Выбрать",
  },
];

export const groupPrice = plans.find((p) => p.name === "Групповой")!.price;

export const PRICING_API =
  "https://functions.poehali.dev/a9b287a8-a09a-4581-9cbd-877c2f9f2cf2";