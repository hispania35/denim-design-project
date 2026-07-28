import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { useEffect, useState } from "react";
import { cities, getCityBySlug } from "@/data/cities";

const popularCitySlugs = [
  "moskva",
  "sankt-peterburg",
  "novosibirsk",
  "ekaterinburg",
  "kazan",
  "nizhniy-novgorod",
];

const NotFoundPage = () => {
  const [seconds, setSeconds] = useState(7);
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? cities
        .filter(
          (city) =>
            city.name.toLowerCase().includes(normalizedQuery) ||
            city.aliases.some((alias) => alias.includes(normalizedQuery)),
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      window.location.href = "/";
    }, seconds * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [paused]);

  const popularCities = popularCitySlugs
    .map((slug) => getCityBySlug(slug))
    .filter((city): city is NonNullable<typeof city> => Boolean(city));

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4 animate-fade-up">
        <div className="text-8xl font-heading font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
          Страница не найдена
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Возможно, ссылка устарела или страница была удалена
        </p>
        <Button
          className="gradient-primary text-white border-0 font-heading font-semibold"
          onClick={() => window.location.href = "/"}
        >
          <Icon name="ArrowRight" size={16} className="rotate-180" />
          Вернуться на главную
        </Button>
        <div
          className="mt-10 max-w-md mx-auto relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative">
            <Icon
              name="Search"
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setPaused(true)}
              placeholder="Найдите свой город"
              className="pl-10"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 rounded-lg border border-border bg-background shadow-lg overflow-hidden text-left">
              {searchResults.map((city) => (
                <a
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {city.name}
                </a>
              ))}
            </div>
          )}
          {normalizedQuery && searchResults.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Город не найден
            </p>
          )}
        </div>
        <div className="mt-8">
          <p className="text-muted-foreground text-sm mb-4">
            Популярные города:
          </p>
          <div
            className="flex flex-wrap justify-center gap-2 max-w-md mx-auto"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {popularCities.map((city) => (
              <a
                key={city.slug}
                href={`/${city.slug}`}
                className="px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {city.name}
              </a>
            ))}
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-8">
          {paused
            ? "Отсчёт на паузе — выберите город"
            : `Автоматический переход на главную через ${seconds} сек.`}
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;