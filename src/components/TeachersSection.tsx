import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useContent } from "@/hooks/useContent";

const TeachersSection = () => {
  const c = useContent("teachers");
  return (
    <section id="teachers" className="py-24 bg-gradient-to-b from-purple-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Icon name="GraduationCap" size={16} />
            {c.badge}
          </div>
          <h2 className="font-heading font-800 text-4xl lg:text-5xl mb-4">
            <span className="gradient-text">{c.name}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-[minmax(0,380px)_1fr] gap-8 md:gap-12 items-start max-w-4xl mx-auto">
          <div className="md:sticky md:top-24">
            <div className="group overflow-hidden rounded-2xl border border-border/50 bg-white shadow-sm">
              <img
                src={c.image}
                alt={`${c.name} — преподаватель языковой студии Hispania`}
                loading="lazy"
                className="w-full aspect-[3/4] object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <Button
              className="w-full mt-4 h-12 gradient-primary text-white border-0 font-heading font-semibold"
              onClick={() =>
                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Icon name="CalendarCheck" size={18} className="mr-2" />
              Записаться к преподавателю
            </Button>
          </div>

          <div className="space-y-4">
            {c.description
              .split(/\n+/)
              .map((p) => p.trim())
              .filter(Boolean)
              .map((p) => (
                <p
                  key={p.slice(0, 30)}
                  className={`text-muted-foreground leading-relaxed${p.startsWith("Опыт и профессиональное развитие:") || p.startsWith("Направления работы:") ? " font-bold" : ""}`}
                >
                  {p}
                </p>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;