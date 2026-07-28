import { useState } from "react";
import Icon from "@/components/ui/icon";
import { groupPrice } from "@/data/pricing";

const faqs = [
  {
    question: "Сколько человек в группе?",
    answer: "В наших группах максимум 6 человек — это позволяет уделять внимание каждому ученику и создать живую разговорную атмосферу.",
  },
  {
    question: "Можно ли заниматься онлайн?",
    answer: "Да, все курсы доступны онлайн. Занятия проходят в видеоформате, качество не уступает очным урокам.",
  },
  {
    question: "Есть ли бесплатное пробное занятие?",
    answer: "Да, первое занятие бесплатно. Вы познакомитесь с преподавателем, определите свой уровень и решите, подходит ли вам наш формат.",
  },
  {
    question: "Какие языки можно изучать?",
    answer: "В студии Hispania вы можете изучать испанский, немецкий и английский языки — в мини-группах или индивидуально, онлайн или в Вологде.",
  },
  {
    question: "Можно ли заниматься индивидуально?",
    answer: "Да, мы проводим индивидуальные занятия один на один с преподавателем — по персональной программе и в удобном для вас графике. Это подходит тем, кто хочет максимально быстрый результат или готовится к конкретной цели.",
  },
  {
    question: "Сколько стоят занятия?",
    answer: `Стоимость зависит от формата: групповые занятия от ${groupPrice} руб./урок, индивидуальные — по запросу. Первое занятие всегда бесплатно.`,
  },
];

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
            <Icon name="HelpCircle" size={16} />
            Вопросы и ответы
          </div>
          <h2 className="font-heading font-800 text-4xl lg:text-5xl mb-4">
            Часто задаваемые <span className="gradient-text">вопросы</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Отвечаем на самые популярные вопросы о наших курсах
          </p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span className="font-heading font-semibold text-base">{faq.question}</span>
                <Icon
                  name="ChevronDown"
                  size={20}
                  className={`text-muted-foreground shrink-0 transition-transform duration-200 ${open === index ? "rotate-180" : ""}`}
                />
              </button>
              {open === index && (
                <div className="px-6 pb-5 text-muted-foreground leading-relaxed text-sm">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;