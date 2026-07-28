import Icon from "@/components/ui/icon";

const features = [
  { icon: "User", title: "Индивидуальные занятия", description: "Персональная программа и удобный график — занятия один на один с преподавателем" },
  { icon: "Monitor", title: "Полностью онлайн", description: "Занимайтесь из дома из любого города России — нужен только интернет" },
  { icon: "Target", title: "Результат с первого урока", description: "Коммуникативная методика: вы начинаете говорить уже на первом занятии" },
  { icon: "Award", title: "Подготовка к экзаменам", description: "DELE, Goethe-Zertifikat — готовим к международным сертификатам" },
  { icon: "Users", title: "Мини-группы до 6 человек", description: "Максимум внимания каждому ученику и живое общение на каждом занятии" },
];

const AboutSectionOnline = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-purple-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
            <Icon name="Heart" size={16} />
            О студии
          </div>
          <h2 className="font-heading font-800 text-4xl lg:text-5xl mb-4">
            Почему выбирают <span className="gradient-text">Hispania</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Мы создали пространство, где изучение языков — это удовольствие, а не зубрёжка
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="hover-lift group rounded-2xl p-6 bg-white border border-border/50 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Icon name={feature.icon} size={24} className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSectionOnline;