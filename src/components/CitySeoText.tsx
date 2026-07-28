import Icon from "@/components/ui/icon";
import { CityData } from "@/data/cities";

interface CitySeoTextProps {
  city: CityData;
}

const CitySeoText = ({ city }: CitySeoTextProps) => {
  return (
    <section className="py-24 bg-gradient-to-b from-purple-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Icon name="GraduationCap" size={16} />
            {city.name}
          </div>
          <h2 className="font-heading font-800 text-3xl lg:text-4xl mb-4">
            Изучение иностранных языков {city.nameIn}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Языковая студия <span className="font-semibold text-foreground">Hispania</span> приглашает
            жителей {city.nameGenitive} на онлайн-курсы испанского, немецкого и английского языка.
            Вы занимаетесь из дома в удобное время — не нужно тратить часы на дорогу через весь город,
            а качество уроков ничем не уступает очным занятиям.
          </p>
          <p>
            <span className="font-semibold text-foreground">Курсы испанского языка {city.nameIn}</span> подойдут
            и начинающим с нуля, и тем, кто готовится к экзамену DELE.
            <span className="font-semibold text-foreground"> Курсы немецкого {city.nameIn}</span> помогут
            подготовиться к Goethe-Zertifikat, поступлению или переезду.
            <span className="font-semibold text-foreground"> Курсы английского {city.nameIn}</span> —
            для работы, путешествий и свободного общения.
          </p>
          <p>
            Мы обучаем индивидуально и в мини-группах до 6 человек, поэтому каждый ученик из {city.nameGenitive}
            {" "}получает максимум внимания преподавателя. Запишитесь на бесплатное пробное занятие —
            познакомитесь с преподавателем, определите свой уровень и убедитесь, что наш формат вам подходит.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CitySeoText;
