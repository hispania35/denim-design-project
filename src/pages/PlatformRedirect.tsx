import { useEffect } from "react";

const PLATFORM_URL = "https://hispania-35.ru/";
const LOGO_URL =
  "https://cdn.poehali.dev/projects/a8294440-d983-4c3b-a5e7-85b5d812d683/bucket/3e27e9ba-d1eb-4bf1-8b0a-599d41647b68.png";

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="text-center">
        <img
          src={LOGO_URL}
          alt="Hispania 35"
          className="mx-auto w-48 h-48 object-contain animate-pulse"
        />
        <p className="mt-4 text-sm text-muted-foreground">
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
