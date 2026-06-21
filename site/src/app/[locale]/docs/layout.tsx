import type { ReactNode } from "react";
import Sidebar, { MobileSidebar } from "../../../components/docs/Sidebar";

export default function DocsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 md:py-12">
      <MobileSidebar />
      <div className="mt-6 grid gap-10 md:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden md:sticky md:top-24 md:block md:self-start">
          <Sidebar />
        </aside>
        <div className="min-w-0 max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
