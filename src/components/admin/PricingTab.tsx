import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { PRICING_API, type Plan } from "@/data/pricing";

interface PricingTabProps {
  token: string;
  onExpired: () => void;
}

const emptyPlan: Plan = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  priceByn: "",
  oldPriceByn: "",
  unit: "урок",
  gradient: "gradient-card-blue",
  features: [],
  popular: false,
  cta: "Выбрать",
};

const PricingTab = ({ token, onExpired }: PricingTabProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(PRICING_API)
      .then((r) => r.json())
      .then((data) => setPlans(data.plans || []))
      .catch(() => toast({ title: "Не удалось загрузить цены", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const update = (i: number, field: keyof Plan, value: string | boolean | string[]) => {
    setPlans((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  };

  const move = (i: number, dir: -1 | 1) => {
    setPlans((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(PRICING_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ mode: "pricing_save", plans }),
      });
      const data = await res.json();
      if (res.status === 401) {
        toast({ title: "Сессия истекла, войдите заново", variant: "destructive" });
        onExpired();
        return;
      }
      if (!res.ok || !data.ok) throw new Error();
      setPlans(data.plans);
      toast({ title: "Цены сохранены" });
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-800 text-xl">Цены на тарифы</h2>
        <Button className="gradient-primary text-white" onClick={save} disabled={saving}>
          <Icon name="Save" size={18} />
          {saving ? "Сохраняем..." : "Сохранить"}
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Загрузка...</p>}

      <div className="space-y-6">
        {plans.map((plan, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon name="Tag" size={18} className="text-purple-600" />
                <span className="font-heading font-bold">{plan.name || "Без названия"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0}>
                  <Icon name="ChevronUp" size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => move(i, 1)}
                  disabled={i === plans.length - 1}
                >
                  <Icon name="ChevronDown" size={18} />
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Название" value={plan.name} onChange={(v) => update(i, "name", v)} />
              <Field label="Описание" value={plan.description} onChange={(v) => update(i, "description", v)} />
              <Field label="Цена, ₽" value={plan.price} onChange={(v) => update(i, "price", v)} />
              <Field label="Старая цена, ₽" value={plan.oldPrice || ""} onChange={(v) => update(i, "oldPrice", v)} />
              <Field label="Цена, Br (BYN)" value={plan.priceByn} onChange={(v) => update(i, "priceByn", v)} />
              <Field label="Старая цена, Br" value={plan.oldPriceByn || ""} onChange={(v) => update(i, "oldPriceByn", v)} />
              <Field label="Единица (за что)" value={plan.unit} onChange={(v) => update(i, "unit", v)} />
              <Field label="Текст кнопки" value={plan.cta} onChange={(v) => update(i, "cta", v)} />
            </div>

            <div className="mt-4">
              <Label>Что входит (каждый пункт с новой строки)</Label>
              <textarea
                className="mt-2 w-full rounded-xl border border-input p-3 text-sm min-h-[100px]"
                value={plan.features.join("\n")}
                onChange={(e) => update(i, "features", e.target.value.split("\n").filter(Boolean))}
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Switch checked={plan.popular} onCheckedChange={(v) => update(i, "popular", v)} />
              <Label>Отметить как «Популярный»</Label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => setPlans((prev) => [...prev, { ...emptyPlan }])}>
          <Icon name="Plus" size={18} />
          Добавить тариф
        </Button>
        {plans.length > 0 && (
          <Button
            variant="outline"
            className="text-red-600"
            onClick={() => setPlans((prev) => prev.slice(0, -1))}
          >
            <Icon name="Trash2" size={18} />
            Удалить последний
          </Button>
        )}
      </div>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1" />
  </div>
);

export default PricingTab;
