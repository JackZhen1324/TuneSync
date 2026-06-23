import type { ReactNode } from "react";
import Sidebar, { MobileSidebar } from "../../../components/docs/Sidebar";
import ScrollProgress from "../../../components/docs/ScrollProgress";

export default function DocsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <div className="container-page py-8 md:py-12">
        <MobileSidebar />
        <div className="mt-6 grid gap-12 md:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="hidden md:sticky md:top-24 md:block md:self-start">
            <Sidebar />
          </aside>
          <div className="min-w-0 max-w-3xl">{children}</div>
        </div>
      </div>
    </>
  );
}
