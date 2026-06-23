"use client";

import { useTranslations } from "next-intl";

const ITEMS = [
  "WebDAV",
  "SMB",
  "NFS",
  "FTP",
  "DAAP",
  "Bonjour",
];

export default function TrustBar() {
  const t = useTranslations("home");

  return (
    <section
      aria-label={t("trustLabel")}
      className="border-y bg-black text-white"
      style={{
        borderColor: "rgb(255 255 255 / 0.18)",
      }}
    >
      <div className="container-page grid gap-4 py-6 text-sm md:grid-cols-[14rem_1fr] md:items-center">
        <p className="font-medium uppercase tracking-[0.16em] text-white/52">
          {t("trustLabel")}
        </p>
        <div className="grid grid-cols-3 gap-px overflow-hidden border border-white/16 bg-white/16 sm:grid-cols-6">
          {ITEMS.map((item) => (
            <span
              key={item}
              className="bg-black px-4 py-3 text-center font-medium text-white/82"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
