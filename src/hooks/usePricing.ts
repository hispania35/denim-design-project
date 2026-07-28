import { useEffect, useState } from "react";
import { plans as fallbackPlans, PRICING_API, type Plan } from "@/data/pricing";

let cache: Plan[] | null = null;

export const usePricing = () => {
  const [plans, setPlans] = useState<Plan[]>(cache ?? fallbackPlans);

  useEffect(() => {
    if (cache) return;
    let active = true;
    fetch(PRICING_API)
      .then((r) => r.json())
      .then((data) => {
        if (active && Array.isArray(data.plans) && data.plans.length > 0) {
          cache = data.plans;
          setPlans(data.plans);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return plans;
};
