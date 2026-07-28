import { useEffect } from "react";

interface MetaOptions {
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
}

const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

export const useMeta = ({ title, description, canonical, noindex }: MetaOptions) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonical, "property");

    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const prevRobots = robots?.getAttribute("content") ?? "";
    if (noindex) setMeta("robots", "noindex, nofollow");

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevHref = link?.getAttribute("href") ?? "";
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);

    return () => {
      document.title = prevTitle;
      if (link && prevHref) link.setAttribute("href", prevHref);
      if (noindex && robots) robots.setAttribute("content", prevRobots || "index, follow");
    };
  }, [title, description, canonical, noindex]);
};