import { useEffect } from "react";

const PLATFORM_URL = "https://language-learning-platform-4--preview.poehali.dev/";

const PlatformRedirect = () => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, follow";
    document.head.appendChild(meta);
    window.location.replace(PLATFORM_URL);
    return () => {
      meta.remove();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <h1 className="font-heading text-2xl font-bold">Открываем платформу обучения</h1>
        <p className="mt-3 text-muted-foreground">
          Если переход не произошёл,{" "}
          <a href={PLATFORM_URL} className="text-primary font-medium underline">
            нажмите сюда
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PlatformRedirect;
