import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "../../components/marketing/Hero";
import TrustBar from "../../components/marketing/TrustBar";
import PillarsSection from "../../components/marketing/PillarsSection";
import DownloadSection from "../../components/marketing/DownloadSection";
import AISection from "../../components/marketing/AISection";
import BuiltDifferentSection from "../../components/marketing/BuiltDifferentSection";
import WorkflowDemo from "../../components/marketing/WorkflowDemo";
import EditorDemo from "../../components/marketing/EditorDemo";
import TestimonialsSection from "../../components/marketing/TestimonialsSection";
import CTASection from "../../components/marketing/CTASection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Reserved for future per-page copy beyond the demos' own hooks.
  void (await getTranslations("home"));

  return (
    <>
      <Hero />
      <TrustBar />
      <PillarsSection />

      {/* Codex-style dynamic agent-workflow demo (replaces static screenshot). */}
      <WorkflowDemo />

      <div className="hr-soft mx-auto max-w-7xl" />

      {/* Codex-style dynamic editor visualization (replaces static screenshot). */}
      <EditorDemo />

      <div className="hr-soft mx-auto max-w-7xl" />

      <AISection />

      <BuiltDifferentSection />
      <DownloadSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
