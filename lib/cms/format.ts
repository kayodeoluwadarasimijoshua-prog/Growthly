import { websitePackages } from "@/config/business";
import type { CmsSettings } from "./schema";
export function packagesFor(settings: Pick<CmsSettings, "prices">) {
  const amounts = [
    settings.prices.starter,
    settings.prices.business,
    settings.prices.ecommerce,
  ];
  return websitePackages.map((p, i) => ({
    ...p,
    priceValue: amounts[i],
    price: `From ₦${amounts[i].toLocaleString("en-NG")}`,
  }));
}
/** Replace trusted default price amounts in one pass; do not chain substitutions. */
export function priceText(
  value: string,
  settings: Pick<CmsSettings, "prices">,
) {
  const p = packagesFor(settings);
  const map = Object.fromEntries(
    websitePackages.map((old, i) => [
      `₦${old.priceValue.toLocaleString("en-NG")}`,
      `₦${p[i].priceValue.toLocaleString("en-NG")}`,
    ]),
  );
  return value
    .replace(
      /₦(?:100,000|200,000|300,000)(?![0-9]|,[0-9])/g,
      (m) => map[m] ?? m,
    )
    .replaceAll("{{starter_price}}", p[0].price)
    .replaceAll("{{business_price}}", p[1].price)
    .replaceAll("{{ecommerce_price}}", p[2].price);
}

export const defaultPrices = {
  starter: websitePackages[0].priceValue,
  business: websitePackages[1].priceValue,
  ecommerce: websitePackages[2].priceValue,
};

/** Explicit tokens for editable answers; arbitrary amounts in custom copy are never rewritten. */
export function expandPriceTokens(
  value: string,
  settings: Pick<CmsSettings, "prices">,
) {
  const p = packagesFor(settings);
  let out = value;
  for (const [i, key] of ["starter", "business", "ecommerce"].entries())
    out = out
      .replaceAll(`{{${key}_price}}`, p[i].price)
      .replaceAll(
        `{{${key}_amount}}`,
        `₦${p[i].priceValue.toLocaleString("en-NG")}`,
      );
  return out;
}
