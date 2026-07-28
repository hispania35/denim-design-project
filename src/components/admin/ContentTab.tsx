import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { PRICING_API } from "@/data/pricing";
import { defaultContent, type ContentKey } from "@/hooks/useContent";

interface ContentTabProps {
  token: string;
  onExpired: () => void;
}

interface FieldDef {
  key: string;
  label: string;
  multiline?: boolean;
}

const SCHEMA: { section: ContentKey; title: string; icon: string; fields: FieldDef[] }[] = [
  {
    section: "hero",
    title: "Главный экран",
    icon: "Home",
    fields: [
      { key: "badge", label: "Плашка сверху" },
      { key: "titleStart", label: "Заголовок — начало" },
      { key: "titleAccent", label: "Заголовок — выделенное слово" },
      { key: "titleEnd", label: "Заголовок — конец" },
      { key: "description", label: "Описание", multiline: true },
      { key: "primaryBtn", label: "Кнопка (основная)" },
      { key: "secondaryBtn", label: "Кнопка (вторая)" },
      { key: "stat1Value", label: "Цифра 1" },
      { key: "stat1Label", label: "Подпись к цифре 1" },
      { key: "stat2Value", label: "Цифра 2" },
      { key: "stat2Label", label: "Подпись к цифре 2" },
      { key: "image", label: "Ссылка на картинку" },
    ],
  },
  {
    section: "teachers",
    title: "Преподаватель",
    icon: "GraduationCap",
    fields: [
      { key: "badge", label: "Плашка сверху" },
      { key: "name", label: "Имя" },
      { key: "description", label: "Описание", multiline: true },
      { key: "image", label: "Ссылка на фото" },
    ],
  },
];

const ContentTab = ({ token, onExpired }: ContentTabProps) => {
  const [data, setData] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    fetch(PRICING_API)
      .then((r) => r.json())
      .then((res) => {
        const merged: Record<string, Record<string, string>> = {};
        SCHEMA.forEach(({ section }) => {
          merged[section] = {
            ...(defaultContent[section] as Record<string, string>),
            ...((res.content && res.content[section]) || {}),
          };
        });
        setData(merged);
      })
      .catch(() => toast({ title: "Не удалось загрузить контент", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const update = (section: string, field: string, value: string) => {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const save = async (section: string) => {
    setSavingKey(section);
    try {
      const res = await fetch(PRICING_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ mode: "content_save", section, content: data[section] }),
      });
      const result = await res.json();
      if (res.status === 401) {
        toast({ title: "Сессия истекла, войдите заново", variant: "destructive" });
        onExpired();
        return;
      }
      if (!res.ok || !result.ok) throw new Error();
      toast({ title: "Сохранено" });
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-800 text-xl">Содержимое разделов</h2>
        <p className="text-sm text-muted-foreground">
          Редактируйте тексты и изображения. Каждый раздел сохраняется отдельно.
        </p>
      </div>

      <div className="space-y-6">
        {SCHEMA.map(({ section, title, icon, fields }) => (
          <div key={section} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon name={icon} size={18} className="text-purple-600" />
                <span className="font-heading font-bold">{title}</span>
              </div>
              <Button
                className="gradient-primary text-white"
                size="sm"
                onClick={() => save(section)}
                disabled={savingKey === section}
              >
                <Icon name="Save" size={16} />
                {savingKey === section ? "..." : "Сохранить"}
              </Button>
            </div>

            {(section === "hero" || section === "teachers") &&
              data[section]?.image && (
                <img
                  src={data[section].image}
                  alt=""
                  className="w-24 h-24 rounded-xl object-cover mb-4 border"
                />
              )}

            <div className="grid sm:grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.key} className={f.multiline ? "sm:col-span-2" : ""}>
                  <Label className="text-xs text-muted-foreground">{f.label}</Label>
                  {f.multiline ? (
                    <textarea
                      className="mt-1 w-full rounded-xl border border-input p-3 text-sm min-h-[80px]"
                      value={data[section]?.[f.key] ?? ""}
                      onChange={(e) => update(section, f.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      className="mt-1"
                      value={data[section]?.[f.key] ?? ""}
                      onChange={(e) => update(section, f.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentTab;
