import { useEffect, useState } from "react";
import { PRICING_API } from "@/data/pricing";

export const defaultContent = {
  hero: {
    badge: "Языковая студия в Вологде · набор на 2026 год открыт",
    titleStart: "Говори на",
    titleAccent: "языке",
    titleEnd: "своей мечты",
    description:
      "Английский, немецкий и испанский в Вологде — от нуля до свободного общения. Занятия в студии на Козленской и онлайн, современные методики и живая практика с первого урока.",
    primaryBtn: "Записаться на пробное",
    secondaryBtn: "Узнать больше",
    stat1Value: "500+",
    stat1Label: "учеников",
    stat2Value: "15 лет",
    stat2Label: "опыта",
    image:
      "https://cdn.poehali.dev/projects/c066c37a-f840-40ae-bf25-35290452380d/files/803028f6-6301-487d-bdfa-c9513189e123.jpg",
  },
  teachers: {
    badge: "Ваш наставник",
    name: "Седова Ольга",
    description: "Сертифицированный преподаватель с международным опытом",
    image:
      "https://cdn.poehali.dev/projects/c066c37a-f840-40ae-bf25-35290452380d/bucket/35f364a9-ef21-4a45-9003-9875215dd2ca.jpg",
  },
};

export type ContentKey = keyof typeof defaultContent;
export type SectionContent<K extends ContentKey> = (typeof defaultContent)[K];

let cache: Record<string, Record<string, string>> | null = null;

export function useContent<K extends ContentKey>(key: K): SectionContent<K> {
  const [content, setContent] = useState<SectionContent<K>>(
    () => ({ ...defaultContent[key], ...(cache?.[key] || {}) }) as SectionContent<K>,
  );

  useEffect(() => {
    if (cache) return;
    let active = true;
    fetch(PRICING_API)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        cache = data.content || {};
        setContent(
          { ...defaultContent[key], ...(cache?.[key] || {}) } as SectionContent<K>,
        );
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [key]);

  return content;
}