"use client";
import { createContext, useContext, type ReactNode } from "react";
import { defaultPrices } from "@/lib/cms/format";
import { business } from "@/config/business";
import type { CmsSettings } from "@/lib/cms/schema";
type PublicSettings = Pick<
  CmsSettings,
  "whatsapp" | "alternativePhone" | "prices" | "tagline"
>;
const Context = createContext<{
  settings: PublicSettings;
  available: boolean;
  projectServices: Readonly<Record<string, string>>;
}>({
  settings: {
    whatsapp: business.contact.whatsapp,
    alternativePhone: business.contact.alternativePhone,
    tagline: business.tagline,
    prices: defaultPrices,
  },
  available: true,
  projectServices: {},
});
export function PublicSiteSettings({
  settings,
  available,
  children,
  projectServices = {},
}: {
  settings: PublicSettings;
  available: boolean;
  children: ReactNode;
  projectServices?: Readonly<Record<string, string>>;
}) {
  return (
    <Context.Provider value={{ settings, available, projectServices }}>
      {children}
    </Context.Provider>
  );
}
export function usePublicSettings() {
  return useContext(Context);
}
