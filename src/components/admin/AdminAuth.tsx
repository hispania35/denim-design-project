import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { PRICING_API } from "@/data/pricing";

type Step = "password" | "code" | "reset-code";

interface AdminAuthProps {
  onSuccess: (token: string) => void;
}

const api = async (payload: Record<string, unknown>) => {
  const res = await fetch(PRICING_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
};

const AdminAuth = ({ onSuccess }: AdminAuthProps) => {
  const [step, setStep] = useState<Step>("password");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const requestLogin = async () => {
    if (!password) return;
    setBusy(true);
    try {
      const { status, data } = await api({ mode: "admin_login_request", password });
      if (status === 401) {
        toast({ title: "Неверный пароль", variant: "destructive" });
        return;
      }
      if (!data.ok) throw new Error();
      setStep("code");
      toast({ title: "Код отправлен на почту" });
    } catch {
      toast({ title: "Ошибка. Попробуйте ещё раз", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const verifyLogin = async () => {
    if (code.length !== 8) return;
    setBusy(true);
    try {
      const { status, data } = await api({ mode: "admin_login_verify", code });
      if (status === 429 || data.blocked) {
        toast({
          title: data.error || "Слишком много попыток. Попробуйте позже.",
          variant: "destructive",
        });
        return;
      }
      if (!data.ok || !data.token) {
        toast({ title: "Неверный или просроченный код", variant: "destructive" });
        return;
      }
      onSuccess(data.token);
    } catch {
      toast({ title: "Ошибка проверки кода", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const requestReset = async () => {
    setBusy(true);
    try {
      const { data } = await api({ mode: "admin_reset_request" });
      if (!data.ok) throw new Error();
      setStep("reset-code");
      setCode("");
      toast({ title: "Код для сброса отправлен на почту" });
    } catch {
      toast({ title: "Ошибка. Попробуйте ещё раз", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const confirmReset = async () => {
    if (code.length !== 8 || newPassword.length < 6) return;
    setBusy(true);
    try {
      const { data } = await api({ mode: "admin_reset_confirm", code, newPassword });
      if (!data.ok) {
        toast({
          title: data.error === "Пароль минимум 6 символов" ? data.error : "Неверный или просроченный код",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Пароль изменён. Войдите заново" });
      setStep("password");
      setPassword("");
      setCode("");
      setNewPassword("");
    } catch {
      toast({ title: "Ошибка сброса пароля", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="ShieldCheck" size={22} className="text-purple-600" />
          <h1 className="font-heading font-800 text-xl">Вход в админку</h1>
        </div>

        {step === "password" && (
          <>
            <Label htmlFor="pwd">Пароль администратора</Label>
            <Input
              id="pwd"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && requestLogin()}
              className="mt-2 mb-4"
              placeholder="Введите пароль"
              autoFocus
            />
            <Button
              className="w-full gradient-primary text-white"
              onClick={requestLogin}
              disabled={busy || !password}
            >
              {busy ? "Отправляем код..." : "Продолжить"}
            </Button>
            <button
              className="mt-4 text-sm text-muted-foreground hover:text-purple-600 w-full text-center"
              onClick={requestReset}
              disabled={busy}
            >
              Забыли пароль?
            </button>
          </>
        )}

        {step === "code" && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Мы отправили 8-значный код на почту студии. Введите его для входа.
            </p>
            <Label htmlFor="code">Код из письма</Label>
            <Input
              id="code"
              inputMode="numeric"
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && verifyLogin()}
              className="mt-2 mb-4 tracking-[0.4em] text-center text-lg"
              placeholder="00000000"
              autoFocus
            />
            <Button
              className="w-full gradient-primary text-white"
              onClick={verifyLogin}
              disabled={busy || code.length !== 8}
            >
              {busy ? "Проверяем..." : "Войти"}
            </Button>
            <button
              className="mt-4 text-sm text-muted-foreground hover:text-purple-600 w-full text-center"
              onClick={() => {
                setStep("password");
                setCode("");
              }}
            >
              Назад
            </button>
          </>
        )}

        {step === "reset-code" && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Код для сброса отправлен на почту студии. Введите его и задайте новый пароль.
            </p>
            <Label htmlFor="rcode">Код из письма</Label>
            <Input
              id="rcode"
              inputMode="numeric"
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="mt-2 mb-4 tracking-[0.4em] text-center text-lg"
              placeholder="00000000"
              autoFocus
            />
            <Label htmlFor="npwd">Новый пароль (минимум 6 символов)</Label>
            <Input
              id="npwd"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 mb-4"
              placeholder="Новый пароль"
            />
            <Button
              className="w-full gradient-primary text-white"
              onClick={confirmReset}
              disabled={busy || code.length !== 8 || newPassword.length < 6}
            >
              {busy ? "Сохраняем..." : "Сменить пароль"}
            </Button>
            <button
              className="mt-4 text-sm text-muted-foreground hover:text-purple-600 w-full text-center"
              onClick={() => {
                setStep("password");
                setCode("");
                setNewPassword("");
              }}
            >
              Назад
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAuth;