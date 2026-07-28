import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

const BOOKING_API = "https://functions.poehali.dev/274de1ff-48fd-46a1-bb99-5d28f14e6f38";
const MAX_URL = "https://max.ru/u/f9LHodD0cOKZsNO_3_ers42wYlOir_XREeTGJirv8m5T5FVHokYu5Ac6000";

const CallbackButton = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const close = () => {
    setOpen(false);
    setSent(false);
    setForm({ name: "", phone: "" });
    setAgree(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({ title: "Заполните имя и телефон", variant: "destructive" });
      return;
    }
    if (!agree) {
      toast({ title: "Подтвердите согласие на обработку данных", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(BOOKING_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          requestType: "callback",
          city: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      toast({ title: "Ошибка отправки", description: "Попробуйте ещё раз", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Заказать обратный звонок"
        className="group fixed right-5 bottom-40 z-40 w-14 h-14 rounded-full gradient-primary text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform animate-float"
      >
        <Icon name="Phone" size={24} />
        <span className="absolute inset-0 rounded-full gradient-primary animate-ping opacity-30" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background opacity-0 translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
          Позвонить
        </span>
      </button>

      <a
        href={MAX_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в мессенджер Макс"
        className="group fixed right-5 bottom-24 z-40 w-14 h-14 rounded-full bg-[#2A7EFF] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Icon name="MessageCircle" size={24} />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background opacity-0 translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
          Написать в Макс
        </span>
      </a>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={close}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-background rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={close}
              aria-label="Закрыть"
            >
              <Icon name="X" size={20} />
            </button>

            {sent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Icon name="Check" size={32} className="text-white" />
                </div>
                <h3 className="font-heading font-800 text-2xl mb-2">Заявка принята!</h3>
                <p className="text-muted-foreground">
                  Мы перезвоним вам в ближайшее время.
                </p>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                  <Icon name="Phone" size={26} className="text-white" />
                </div>
                <h3 className="font-heading font-800 text-2xl mb-1">Обратный звонок</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Оставьте телефон — перезвоним и ответим на все вопросы
                </p>

                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Ваше имя</label>
                    <input
                      type="text"
                      required
                      placeholder="Иван"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Телефон</label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (___) ___-__-__"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="callback-agree"
                      checked={agree}
                      onCheckedChange={(checked) => setAgree(checked === true)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor="callback-agree"
                      className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                    >
                      Я согласен на обработку персональных данных и принимаю{" "}
                      <a href="/privacy" target="_blank" className="underline hover:text-foreground transition-colors">
                        политику конфиденциальности
                      </a>
                    </label>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || !agree}
                    className="w-full gradient-primary text-white border-0 font-heading font-semibold rounded-xl h-12"
                  >
                    {loading ? (
                      <>
                        <Icon name="Loader2" size={18} className="animate-spin" />
                        Отправляем...
                      </>
                    ) : (
                      <>
                        Жду звонка
                        <Icon name="PhoneCall" size={18} />
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CallbackButton;