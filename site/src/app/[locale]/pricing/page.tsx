import { setRequestLocale } from "next-intl/server";
import PricingSection from "../../../components/marketing/PricingSection";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PricingSection />;
}
