import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type StoreCurrency = "GBP" | "USD" | "NGN" | "ESPEES";

interface CurrencyContextValue {
  currency: StoreCurrency;
  setCurrency: (currency: StoreCurrency) => void;
}

const STORAGE_KEY = "selah.currency";
const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readCurrency(): StoreCurrency {
  if (typeof window === "undefined") return "GBP";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "USD" || stored === "NGN" || stored === "ESPEES" ? stored : "GBP";
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<StoreCurrency>(readCurrency);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used inside CurrencyProvider");
  return context;
}
