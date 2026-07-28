import Icon from "@/components/ui/icon";

const SeoSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-purple-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Icon name="GraduationCap" size={16} />
            Обучение по всей России
          </div>
          <h2 className="font-heading font-800 text-4xl lg:text-5xl mb-4">
            Курсы иностранных языков <span className="gradient-text">онлайн</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Учитесь из любого города России — Москва, Санкт-Петербург, Екатеринбург, Новосибирск, Казань и не только
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Языковая студия <span className="font-semibold text-foreground">Hispania</span> — это
            онлайн-курсы испанского, немецкого и английского языка для всех, кто хочет заговорить
            на иностранном языке быстро и без зубрёжки. Мы обучаем индивидуально и в мини-группах
            до 6 человек, поэтому каждый ученик получает максимум внимания преподавателя.
          </p>
          <p>
            <span className="font-semibold text-foreground">Курсы испанского языка онлайн</span> подойдут
            и для начинающих с нуля, и для тех, кто хочет подтянуть разговорный уровень или
            подготовиться к экзамену DELE. <span className="font-semibold text-foreground">Курсы
            немецкого</span> помогут подготовиться к Goethe-Zertifikat, поступлению в вуз или
            переезду. <span className="font-semibold text-foreground">Курсы английского</span> —
            для работы, путешествий и свободного общения.
          </p>
          <p>
            Заниматься онлайн удобно из любой точки России: вам не нужно тратить время на дорогу,
            а качество уроков ничем не уступает очным занятиям. Первое пробное занятие — бесплатно:
            вы познакомитесь с преподавателем, определите свой уровень и убедитесь, что наш формат
            вам подходит.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          {[
            { icon: "Globe", title: "Вся Россия", text: "Онлайн-занятия из любого города" },
            { icon: "Clock", title: "Удобное время", text: "Подберём расписание под вас" },
            { icon: "Gift", title: "Первый урок бесплатно", text: "Знакомство без обязательств" },
          ].map((item, index) => (
            <div key={index} className="rounded-2xl p-6 bg-white border border-border/50 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <Icon name={item.icon} size={22} className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-base mb-1">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeoSection;