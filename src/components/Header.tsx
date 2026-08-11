import { useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const AskQuestionModal = lazy(() => import("@/components/AskQuestionModal"));

const navLinks = [
  { label: "Главная", href: "/#hero" },
  { label: "О студии", href: "/#about" },
  { label: "Языки", href: "/#languages" },
  { label: "Отзывы", href: "/#reviews" },
  { label: "Блог", href: "/blog" },
  { label: "FAQ", href: "/#faq" },
  { label: "Контакты", href: "/#contacts" },
];

const sectionLinks = [
  { label: "Носители языка", href: "/native" },
  { label: "Репетитор испанского", href: "/repetitor-ispanskogo-vologda" },
  { label: "Репетитор немецкого", href: "/repetitor-nemeckogo-vologda" },
  { label: "Репетитор английского", href: "/repetitor-angliyskogo-vologda" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("ask")) {
      setAskOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
    const openHandler = () => setAskOpen(true);
    window.addEventListener("open-discount", openHandler);
    return () => window.removeEventListener("open-discount", openHandler);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/#about" className="font-heading font-900 text-2xl gradient-text">
              Hispania
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setSectionsOpen(true)}
              onMouseLeave={() => setSectionsOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                Разделы
                <Icon name="ChevronDown" size={14} />
              </button>
              {sectionsOpen && (
                <div className="absolute right-0 top-full pt-3">
                  <div className="glass rounded-xl border shadow-lg py-2 min-w-56">
                    {sectionLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors whitespace-nowrap"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              className="font-heading font-semibold"
              onClick={() => setAskOpen(true)}
            >
              <Icon name="MessageCircle" size={16} />
              Получить скидку
            </Button>
            <Button
              className="gradient-primary text-white border-0 font-heading font-semibold"
              onClick={() => { const el = document.getElementById("booking"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
            >
              Записаться
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden glass border-t px-4 pb-4 animate-fade-up">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              className="flex items-center gap-1 w-full py-3 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setSectionsOpen(!sectionsOpen)}
            >
              Разделы
              <Icon name={sectionsOpen ? "ChevronUp" : "ChevronDown"} size={14} />
            </button>
            {sectionsOpen &&
              sectionLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 pl-4 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            <Button
              variant="outline"
              className="w-full mt-2 font-heading font-semibold"
              onClick={() => {
                setMobileOpen(false);
                setAskOpen(true);
              }}
            >
              <Icon name="MessageCircle" size={16} />
              Получить скидку
            </Button>
            <Button
              className="w-full mt-2 gradient-primary text-white border-0 font-heading font-semibold"
              onClick={() => {
                setMobileOpen(false);
                const el = document.getElementById("booking"); if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Записаться
            </Button>
          </div>
        )}
      </header>

      <Suspense fallback={null}>
        <AskQuestionModal open={askOpen} onClose={() => setAskOpen(false)} />
      </Suspense>
    </>
  );
};

export default Header;