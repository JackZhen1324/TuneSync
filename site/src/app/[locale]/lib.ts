import { setRequestLocale } from "next-intl/server";
import type { Locale } from "../../../i18n/routing";

/**
 * Call at the top of every page under [locale] so that static rendering
 * (output: "export") renders each locale deterministically.
 */
export function enableStaticLocale(locale: string) {
  setRequestLocale(locale as Locale);
}
