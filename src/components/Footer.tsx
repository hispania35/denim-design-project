import { useState } from "react";
import Icon from "@/components/ui/icon";

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const shareUrl = "https://hispania35.online/";
  const shareText = "Языковая студия Hispania — испанский, немецкий, английский в Вологде и онлайн!";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Hispania", text: shareText, url: shareUrl });
      } catch (_e) { void _e; }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="py-8 border-t bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="#hero" className="font-heading font-900 text-xl gradient-text">
            Hispania
          </a>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Hispania. Все права защищены.<br />
              ИНН 352527263810
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground transition-colors underline underline-offset-2">
                Политика конфиденциальности
              </a>
              <span className="text-muted-foreground/50">·</span>
              <a href="/oferta" className="hover:text-foreground transition-colors underline underline-offset-2">
                Договор-оферта
              </a>
              <span className="text-muted-foreground/50">·</span>
              <a href="/sitemap.xml" className="hover:text-foreground transition-colors underline underline-offset-2">
                Карта сайта
              </a>
              <span className="text-muted-foreground/50">·</span>
              <button
                onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
                className="hover:text-foreground transition-colors underline underline-offset-2"
              >
                Настроить cookie
              </button>
            </div>
          </div>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            <Icon name={copied ? "Check" : "Share2"} size={16} />
            {copied ? "Ссылка скопирована!" : "Поделиться"}
          </button>
        </div>
        <div className="mt-4 text-center">
          <a
            href="https://landingguru.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            Сайт разработан landingguru.ru
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;