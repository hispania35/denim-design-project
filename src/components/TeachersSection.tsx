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

        <div className="flex justify-center">
          <div className="hover-lift group text-center rounded-2xl overflow-hidden bg-white border border-border/50 shadow-sm max-w-sm w-full">
            <div className="overflow-hidden h-80">
              <img
                src={c.image}
                alt="Преподаватель испанского языка Седова Ольга — языковая студия Hispania"
                loading="lazy"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <p className="text-muted-foreground text-sm">{c.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;