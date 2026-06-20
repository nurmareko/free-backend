import type { ReactNode } from "react";

export const metadata = {
  title: "Free API",
  description: "REST API for the Free giveaway app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <style>{`
          :root {
            --bg: #0a0a0a;
            --fg: #e6e6e6;
            --muted: #8a8a8a;
            --line: #2a2a2a;
            --accent: #e6e6e6;
            --font-ui: "MS Sans Serif", Tahoma, Geneva, Verdana, Arial, sans-serif;
            --font-code: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            color-scheme: dark;
            background: var(--bg);
            color: var(--fg);
          }

          * {
            box-sizing: border-box;
          }

          html {
            min-height: 100%;
          }

          body {
            margin: 0;
            min-height: 100vh;
            overflow-x: hidden;
            background:
              repeating-linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.025) 0,
                rgba(255, 255, 255, 0.025) 1px,
                transparent 1px,
                transparent 4px
              ),
              linear-gradient(rgba(0, 0, 0, 0.54), rgba(0, 0, 0, 0.72)),
              url("/retro-bg-slow.gif"),
              var(--bg);
            background-attachment: fixed, fixed, fixed, scroll;
            background-position: 0 0, center, center, 0 0;
            background-repeat: repeat, no-repeat, no-repeat, repeat;
            background-size: auto, cover, cover, auto;
            color: var(--fg);
            font-family: var(--font-ui);
            font-size: 18px;
            line-height: 1.45;
          }

          main {
            width: min(100% - 24px, 820px);
            margin: 0 auto;
            padding: 28px 0 48px;
          }

          a {
            color: var(--accent);
            text-decoration: none;
          }

          a:hover {
            color: #ffffff;
            text-decoration: underline;
            text-underline-offset: 3px;
          }

          code,
          pre {
            font-family: var(--font-code);
          }

          code {
            color: var(--fg);
          }

          .frame {
            border: 1px solid var(--line);
            background: rgba(10, 10, 10, 0.88);
            padding: 24px;
          }

          .wordmark,
          .section-title {
            font-family: var(--font-ui);
            font-weight: 400;
            letter-spacing: 0.08em;
            line-height: 1.45;
            text-transform: uppercase;
          }

          .wordmark {
            margin: 0;
            color: var(--fg);
            font-size: clamp(1.25rem, 3.5vw, 2rem);
          }

          .tagline {
            margin: 10px 0 0;
            color: var(--muted);
          }

          .pipe-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 0.35rem;
            margin: 18px 0 20px;
            color: var(--muted);
            text-transform: uppercase;
          }

          .marquee {
            overflow: hidden;
            border: 1px solid #3d3328;
            box-shadow:
              inset 0 0 0 3px #050505,
              inset 0 0 20px rgba(0, 0, 0, 0.9),
              0 0 0 1px rgba(255, 160, 48, 0.14);
            margin: 0 0 18px;
            padding: 8px 0;
            background:
              repeating-linear-gradient(
                to bottom,
                rgba(255, 156, 42, 0.08) 0,
                rgba(255, 156, 42, 0.08) 1px,
                transparent 1px,
                transparent 3px
              ),
              linear-gradient(180deg, #16120e 0%, #090807 54%, #030303 100%);
            white-space: nowrap;
          }

          .marquee span {
            display: inline-block;
            min-width: 100%;
            padding-left: 100%;
            animation: marquee-scroll 18s linear infinite;
            color: #ff9f2f;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-shadow:
              0 0 4px rgba(255, 159, 47, 0.72),
              0 0 12px rgba(255, 113, 18, 0.38);
            text-transform: uppercase;
          }

          @keyframes marquee-scroll {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-100%);
            }
          }

          .badges {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 0 0 28px;
          }

          .badge,
          .chip,
          .method,
          .status-code {
            display: inline-flex;
            align-items: center;
            border: 1px solid var(--line);
            border-radius: 0;
            background: #0d0d0d;
            color: var(--fg);
            line-height: 1;
          }

          .badge {
            min-width: 88px;
            height: 31px;
            justify-content: center;
            padding: 0 8px;
            font-size: 16px;
            text-transform: uppercase;
          }

          .chip,
          .method,
          .status-code {
            min-height: 28px;
            padding: 4px 8px;
            font-size: 16px;
          }

          .method {
            min-width: 68px;
            justify-content: center;
            border-color: #d8d8d8;
            color: var(--accent);
          }

          .status-code {
            border-color: #d8d8d8;
            color: var(--accent);
          }

          .section {
            margin-top: 34px;
          }

          .section-title {
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            gap: 12px;
            margin: 0 0 14px;
            color: var(--fg);
            font-size: 0.82rem;
          }

          .section-title::after {
            content: "";
            height: 1px;
            background: var(--line);
          }

          .note,
          .endpoint-row,
          .field-row,
          .status-row,
          .code-block {
            border: 1px solid var(--line);
            background: #0d0d0d;
            border-radius: 0;
          }

          .note {
            padding: 14px;
            color: var(--fg);
          }

          .muted {
            color: var(--muted);
          }

          .endpoint-list,
          .field-list,
          .status-list {
            display: grid;
            gap: 10px;
          }

          .endpoint-row {
            display: grid;
            grid-template-columns: minmax(68px, auto) minmax(170px, 1fr) minmax(110px, auto);
            gap: 12px;
            align-items: start;
            padding: 12px;
          }

          .endpoint-description {
            grid-column: 2 / -1;
            color: var(--muted);
          }

          .field-row,
          .status-row {
            display: grid;
            grid-template-columns: minmax(120px, auto) minmax(90px, auto) 1fr;
            gap: 12px;
            align-items: center;
            padding: 10px 12px;
          }

          .status-row {
            grid-template-columns: minmax(70px, auto) 1fr;
          }

          .code-block {
            overflow-x: auto;
            margin: 0;
            padding: 16px;
            color: var(--fg);
            font-size: 17px;
            line-height: 1.35;
          }

          .footer {
            margin-top: 34px;
            color: var(--muted);
            font-size: 12px;
            line-height: 1.35;
            text-align: center;
          }

          @media (max-width: 640px) {
            body {
              font-size: 16px;
            }

            .frame {
              padding: 16px;
            }

            .endpoint-row,
            .field-row,
            .status-row {
              grid-template-columns: 1fr;
            }

            .endpoint-description {
              grid-column: auto;
            }
          }
        `}</style>
        {children}
      </body>
    </html>
  );
}
