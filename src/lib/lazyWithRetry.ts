import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "chunk-reload-at";

type Importer<T> = () => Promise<{ default: T }>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyWithRetry = <T extends ComponentType<any>>(importer: Importer<T>) =>
  lazy(async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const module = await importer();
        sessionStorage.removeItem(RELOAD_KEY);
        return module;
      } catch (error) {
        if (attempt < 2) {
          await wait(400 * (attempt + 1));
          continue;
        }

        const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
        if (Date.now() - last > 15000) {
          sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
          window.location.reload();
          await wait(5000);
        }
        throw error;
      }
    }
    throw new Error("unreachable");
  });