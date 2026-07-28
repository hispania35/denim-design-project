import Icon from "@/components/ui/icon";

const baseContacts = [
  { icon: "Phone", label: "Телефон", value: "8 (921) 123-82-21", href: "tel:89211238221" },
  { icon: "Mail", label: "Email", value: "hispania35@yandex.ru", href: "mailto:hispania35@yandex.ru" },
  { icon: "MapPin", label: "Адрес", value: "г. Вологда, ул. Козленская, 43б, офис 10", href: "https://yandex.ru/maps/?text=Вологда%2C+ул.+Козленская%2C+43б" },
  { icon: "Clock", label: "Режим работы", value: "Пн-Сб: 9:00 — 21:00", href: "#" },
];

interface ContactsSectionProps {
  city?: string;
}

const ContactsSection = ({ city }: ContactsSectionProps) => {
  const contacts = city
    ? [
        { icon: "Phone", label: "Телефон", value: "8 (921) 123-82-21", href: "tel:89211238221" },
        { icon: "Mail", label: "Email", value: "hispania35@yandex.ru", href: "mailto:hispania35@yandex.ru" },
        { icon: "Monitor", label: `Формат — ${city}`, value: "Занятия только онлайн", href: "#booking" },
        { icon: "Clock", label: "Режим работы", value: "Пн-Сб: 9:00 — 21:00", href: "#" },
      ]
    : baseContacts;

  const socials = [
    { icon: "Users", label: "ВКонтакте", href: "https://vk.com/club119672828" },
    { icon: "MessageCircle", label: "Макс", href: "https://max.ru/u/f9LHodD0cOKZsNO_3_ers42wYlOir_XREeTGJirv8m5T5FVHokYu5Ac6000" },
  ];

  return (
    <section id="contacts" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
            <Icon name="MapPin" size={16} />
            Контакты
          </div>
          <h2 className="font-heading font-800 text-4xl lg:text-5xl mb-4">
            Свяжитесь <span className="gradient-text">с нами</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Ответим на вопросы и поможем подобрать подходящий курс
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contacts.map((contact, index) => (
            <a
              key={index}
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="hover-lift group rounded-2xl p-6 bg-white border border-border/50 shadow-sm text-center"
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Icon name={contact.icon} size={24} className="text-white" />
              </div>
              <div className="text-sm text-muted-foreground mb-1">{contact.label}</div>
              <div className="font-heading font-bold text-sm">{contact.value}</div>
            </a>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.href}
              className="hover-lift w-14 h-14 rounded-2xl bg-white border border-border/50 shadow-sm flex items-center justify-center group"
            >
              <Icon
                name={social.icon}
                size={22}
                className="text-muted-foreground group-hover:text-foreground transition-colors"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;