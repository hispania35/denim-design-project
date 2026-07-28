import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "hispania_cookie_choice";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setVisible(true);
    }
    const openHandler = () => setVisible(true);
    window.addEventListener("open-cookie-settings", openHandler);
    return () => window.removeEventListener("open-cookie-settings", openHandler);
  }, []);

  const decide = (choice: "accepted" | "declined") => {
    localStorage.setItem(COOKIE_KEY, choice);
    if (choice === "accepted") {
      window.dispatchEvent(new Event("cookie-accepted"));
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="flex-1 overflow-hidden py-3 min-w-0">
          <div className="flex w-max animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
            {[0, 1].map((i) => (
              <span
                key={i}
                className="text-xs sm:text-sm text-foreground/80 px-6 sm:px-8"
                aria-hidden={i === 1}
              >
                <span className="font-semibold gradient-text">Hispania</span> использует файлы
                cookie. Продолжая работу с сайтом, вы подтверждаете использование cookies вашего
                браузера, которые помогают делать сайт удобнее. Обработка данных — в соответствии с{" "}
                <a
                  href="/privacy"
                  className="gradient-text font-medium hover:opacity-80 transition-opacity"
                >
                  Политикой обработки персональных данных
                </a>{" "}
                и Уведомлением об использовании файлов cookie.
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 border-t sm:border-t-0 border-border/60 bg-background/70 backdrop-blur">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 sm:flex-none font-heading font-semibold"
            onClick={() => decide("declined")}
          >
            Отклонить
          </Button>
          <Button
            size="sm"
            className="flex-1 sm:flex-none gradient-primary text-white border-0 font-heading font-semibold"
            onClick={() => decide("accepted")}
          >
            Принять
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;