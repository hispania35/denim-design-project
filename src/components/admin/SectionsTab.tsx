import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { PRICING_API } from "@/data/pricing";
import type { SectionSetting } from "@/hooks/useSections";

interface SectionsTabProps {
  token: string;
  onExpired: () => void;
}

const SectionsTab = ({ token, onExpired }: SectionsTabProps) => {
  const [sections, setSections] = useState<SectionSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(PRICING_API)
      .then((r) => r.json())
      .then((data) => setSections(data.sections || []))
      .catch(() => toast({ title: "Не удалось загрузить разделы", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (key: string, value: boolean) => {
    setSections((prev) => prev.map((s) => (s.key === key ? { ...s, visible: value } : s)));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(PRICING_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({
          mode: "sections_save",
          sections: sections.map((s) => ({ key: s.key, visible: s.visible })),
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        toast({ title: "Сессия истекла, войдите заново", variant: "destructive" });
        onExpired();
        return;
      }
      if (!res.ok || !data.ok) throw new Error();
      setSections(data.sections);
      toast({ title: "Настройки разделов сохранены" });
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-800 text-xl">Разделы сайта</h2>
          <p className="text-sm text-muted-foreground">
            Выключенные разделы не показываются на сайте.
          </p>
        </div>
        <Button className="gradient-primary text-white" onClick={save} disabled={saving}>
          <Icon name="Save" size={18} />
          {saving ? "Сохраняем..." : "Сохранить"}
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Загрузка...</p>}

      <div className="space-y-3">
        {sections.map((s) => (
          <div
            key={s.key}
            className="flex items-center justify-between bg-white rounded-xl shadow-sm px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <Icon
                name={s.visible ? "Eye" : "EyeOff"}
                size={18}
                className={s.visible ? "text-purple-600" : "text-muted-foreground"}
              />
              <span className="font-medium">{s.title}</span>
            </div>
            <Switch checked={s.visible} onCheckedChange={(v) => toggle(s.key, v)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionsTab;
