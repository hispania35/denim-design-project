import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { PRICING_API } from "@/data/pricing";
import type { BlogPost } from "@/hooks/useBlog";

interface BlogTabProps {
  token: string;
  onExpired: () => void;
}

type Editing = Partial<BlogPost> | null;

const emptyPost: Editing = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  published: true,
};

const BlogTab = ({ token, onExpired }: BlogTabProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Editing>(null);

  const call = async (payload: Record<string, unknown>) => {
    const res = await fetch(PRICING_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Token": token },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  };

  const load = async () => {
    const { status, data } = await call({ mode: "blog_list" });
    if (status === 401) {
      onExpired();
      return;
    }
    setPosts(data.posts || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    if (!editing?.title?.trim()) {
      toast({ title: "Введите заголовок", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { status, data } = await call({ mode: "blog_save", post: editing });
      if (status === 401) {
        toast({ title: "Сессия истекла, войдите заново", variant: "destructive" });
        onExpired();
        return;
      }
      if (!data.ok) throw new Error();
      setPosts(data.posts || []);
      setEditing(null);
      toast({ title: "Статья сохранена" });
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить статью безвозвратно?")) return;
    const { status, data } = await call({ mode: "blog_delete", id });
    if (status === 401) {
      onExpired();
      return;
    }
    if (data.ok) {
      setPosts(data.posts || []);
      toast({ title: "Статья удалена" });
    }
  };

  const set = (field: keyof BlogPost, value: string | boolean) =>
    setEditing((prev) => ({ ...prev, [field]: value }));

  const uploadPhoto = async (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "Файл больше 8 МБ", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const { status, data } = await call({
        mode: "upload_image",
        image: base64,
        filename: file.name,
      });
      if (status === 401) {
        onExpired();
        return;
      }
      if (!data.ok || !data.url) throw new Error();
      set("coverImage", data.url);
      toast({ title: "Фото загружено" });
    } catch {
      toast({ title: "Не удалось загрузить фото", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-800 text-xl">
            {editing.id ? "Редактирование статьи" : "Новая статья"}
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Отмена
            </Button>
            <Button className="gradient-primary text-white" onClick={save} disabled={saving}>
              <Icon name="Save" size={18} />
              {saving ? "Сохраняем..." : "Сохранить"}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <Label>Заголовок</Label>
            <Input
              className="mt-1"
              value={editing.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Заголовок статьи"
            />
          </div>

          <div>
            <Label>Краткое описание (для списка)</Label>
            <textarea
              className="mt-1 w-full rounded-xl border border-input p-3 text-sm min-h-[70px]"
              value={editing.excerpt ?? ""}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="1-2 предложения, показываются в списке статей"
            />
          </div>

          <div>
            <Label>Обложка статьи (необязательно)</Label>
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <Input
                value={editing.coverImage ?? ""}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="Вставьте ссылку или загрузите фото →"
              />
              <label className="shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadPhoto(file);
                    e.target.value = "";
                  }}
                />
                <span className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-input bg-white text-sm font-medium cursor-pointer hover:bg-muted">
                  <Icon name={uploading ? "Loader" : "Upload"} size={16} />
                  {uploading ? "Загрузка..." : "Загрузить фото"}
                </span>
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-md border border-input bg-white text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Рекомендации по фото"
                  >
                    <Icon name="Info" size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[220px]">
                  Рекомендуемый размер 1200×630 px, формат JPG/WebP, до 500 КБ
                </TooltipContent>
              </Tooltip>
            </div>
            {editing.coverImage && (
              <img
                src={editing.coverImage}
                alt=""
                className="mt-3 w-48 h-28 object-cover rounded-xl border"
              />
            )}
          </div>

          <div>
            <Label>Текст статьи</Label>
            <textarea
              className="mt-1 w-full rounded-xl border border-input p-3 text-sm min-h-[280px]"
              value={editing.content ?? ""}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Текст статьи. Разделяйте абзацы пустой строкой."
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={editing.published ?? true}
              onCheckedChange={(v) => set("published", v)}
            />
            <Label>Опубликовано (показывать на сайте)</Label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-800 text-xl">Статьи блога</h2>
          <p className="text-sm text-muted-foreground">Создавайте и редактируйте статьи.</p>
        </div>
        <Button className="gradient-primary text-white" onClick={() => setEditing({ ...emptyPost })}>
          <Icon name="Plus" size={18} />
          Новая статья
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Загрузка...</p>}

      {!loading && posts.length === 0 && (
        <p className="text-muted-foreground">Статей пока нет. Создайте первую.</p>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between bg-white rounded-xl shadow-sm px-5 py-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon
                name={post.published ? "Eye" : "EyeOff"}
                size={18}
                className={post.published ? "text-purple-600" : "text-muted-foreground"}
              />
              <div className="min-w-0">
                <div className="font-medium truncate">{post.title}</div>
                {!post.published && (
                  <div className="text-xs text-muted-foreground">Черновик</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setEditing(post)}>
                <Icon name="Pencil" size={16} />
                Редактировать
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-600"
                onClick={() => remove(post.id)}
              >
                <Icon name="Trash2" size={16} />
                Удалить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogTab;