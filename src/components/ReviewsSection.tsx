import { useState } from "react";
import Icon from "@/components/ui/icon";

const reviews = [
  { name: "Анна К.", course: "Английский, B1", text: "За полгода занятий я перешла с нуля до уверенного разговорного уровня. Методика действительно работает — начала говорить уже на первом уроке!", rating: 5 },
  { name: "Михаил С.", course: "Немецкий, A2", text: "Готовился к поступлению в немецкий университет. Преподаватель помог не только с языком, но и с подготовкой к Goethe-Zertifikat. Сдал с первого раза!", rating: 5 },
  { name: "Екатерина Л.", course: "Испанский, A1", text: "Хотела выучить испанский для путешествий. Мини-группа — это отличный формат, всегда есть живое общение и внимание преподавателя.", rating: 5 },
  { name: "Дмитрий В.", course: "Английский, B2", text: "Занимаюсь онлайн уже год. Очень удобно — никуда не нужно ехать, а качество занятий ничем не уступает очному формату. Рекомендую!", rating: 5 },
];

const ReviewsSection = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Hispania", text: "Языковая студия Hispania — испанский, немецкий, английский в Вологде и онлайн!", url: "https://hispania35.online/" });
      } catch (_e) { void _e; }
    } else {
      await navigator.clipboard.writeText("https://hispania35.online/");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="reviews" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
            <Icon name="Star" size={16} />
            Отзывы
          </div>
          <h2 className="font-heading font-800 text-4xl lg:text-5xl mb-4">
            Что говорят <span className="gradient-text">наши ученики</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Более 500 учеников уже достигли своих целей вместе с нами
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors bg-white shadow-sm"
          >
            <Icon name={copied ? "Check" : "Share2"} size={16} />
            {copied ? "Ссылка скопирована!" : "Поделиться с другом"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="hover-lift rounded-2xl p-6 bg-white border border-border/50 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Icon key={i} name="Star" size={18} className="text-orange-400 fill-orange-400" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-5 text-sm">
                «{review.text}»
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-heading font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-heading font-bold text-sm">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.course}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;