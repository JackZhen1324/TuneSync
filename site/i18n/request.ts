import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import type { Locale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const resolvedLocale: Locale = routing.locales.includes(
    requested as Locale,
  )
    ? (requested as Locale)
    : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../i18n/messages/${resolvedLocale}.json`))
      .default,
  };
});
