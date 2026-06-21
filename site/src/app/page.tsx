import Link from "next/link";

// Static-export friendly landing for the bare "/" path (emitted as
// <basePath>/index.html). It redirects into the default locale using a
// meta refresh + instant JS redirect, so visitors always land on a fully
// rendered page even on a static host like GitHub Pages.
export default function RootPage() {
  const target = "./zh-CN/";
  return (
    <html lang="zh-CN">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <title>TuneSync</title>
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace(${JSON.stringify(target)});`,
          }}
        />
        <noscript>
          <p style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
            Redirecting to <Link href={target}>TuneSync</Link>.
          </p>
        </noscript>
      </body>
    </html>
  );
}
