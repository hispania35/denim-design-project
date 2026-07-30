import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useMeta } from "@/hooks/useMeta";
import AdminAuth from "@/components/admin/AdminAuth";
import PricingTab from "@/components/admin/PricingTab";
import SectionsTab from "@/components/admin/SectionsTab";
import ContentTab from "@/components/admin/ContentTab";
import BlogTab from "@/components/admin/BlogTab";

type Tab = "pricing" | "sections" | "content" | "blog";

const AdminPricing = () => {
  useMeta({
    title: "Админ-панель | Hispania",
    description: "",
    canonical: "https://hispania35.ru/",
    noindex: true,
  });

  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem("admin_token"),
  );
  const [tab, setTab] = useState<Tab>("pricing");

  const handleAuth = (t: string) => {
    sessionStorage.setItem("admin_token", t);
    setToken(t);
  };

  const logout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  };

  if (!token) {
    return <AdminAuth onSuccess={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading font-800 text-2xl">Админ-панель</h1>
          <Button variant="ghost" onClick={logout}>
            <Icon name="LogOut" size={18} />
            Выйти
          </Button>
        </div>

        <div className="flex gap-2 mb-8 bg-white rounded-xl p-1 w-fit shadow-sm">
          <TabButton active={tab === "pricing"} onClick={() => setTab("pricing")} icon="Tag">
            Цены
          </TabButton>
          <TabButton active={tab === "sections"} onClick={() => setTab("sections")} icon="LayoutList">
            Разделы
          </TabButton>
          <TabButton active={tab === "content"} onClick={() => setTab("content")} icon="PenLine">
            Контент
          </TabButton>
          <TabButton active={tab === "blog"} onClick={() => setTab("blog")} icon="Newspaper">
            Блог
          </TabButton>
        </div>

        {tab === "pricing" && <PricingTab token={token} onExpired={logout} />}
        {tab === "sections" && <SectionsTab token={token} onExpired={logout} />}
        {tab === "content" && <ContentTab token={token} onExpired={logout} />}
        {tab === "blog" && <BlogTab token={token} onExpired={logout} />}
      </div>
    </div>
  );
};

const TabButton = ({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
      active ? "gradient-primary text-white" : "text-muted-foreground hover:bg-muted"
    }`}
  >
    <Icon name={icon} size={16} />
    {children}
  </button>
);

export default AdminPricing;