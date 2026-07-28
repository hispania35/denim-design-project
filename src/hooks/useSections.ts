import { useEffect, useState } from "react";
import { PRICING_API } from "@/data/pricing";

export interface SectionSetting {
  key: string;
  title: string;
  visible: boolean;
  order: number;
}

let cache: Record<string, boolean> | null = null;

export const useSectionVisibility = () => {
  const [visible, setVisible] = useState<Record<string, boolean>>(cache ?? {});
  const [loaded, setLoaded] = useState<boolean>(cache !== null);

  useEffect(() => {
    if (cache) return;
    let active = true;
    fetch(PRICING_API)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const map: Record<string, boolean> = {};
        (data.sections || []).forEach((s: SectionSetting) => {
          map[s.key] = s.visible;
        });
        cache = map;
        setVisible(map);
        setLoaded(true);
      })
      .catch(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const isVisible = (key: string) => visible[key] !== false;

  return { isVisible, loaded };
};
