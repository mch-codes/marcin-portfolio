import { ImageResponse } from "next/og";

export const alt = "Marcin Chrzuszcz — Fullstack Developer & ex-Chef";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#09090b",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: monogram */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              background: "#27272a",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #52525b",
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: "#10b981" }}>MC</span>
          </div>
          <span style={{ fontSize: 14, color: "#71717a", letterSpacing: 2 }}>
            marcin-portfolio.vercel.app
          </span>
        </div>

        {/* Center: name + title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#f4f4f5", lineHeight: 1.05, letterSpacing: -2 }}>
            Marcin Chrzuszcz
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#10b981",
              letterSpacing: -0.5,
            }}
          >
            Fullstack Developer &amp; ex-Chef
          </div>
        </div>

        {/* Bottom: location + stack */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, color: "#71717a" }}>📍</span>
            <span style={{ fontSize: 16, color: "#71717a" }}>Madrid, Spain</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["Next.js", "TypeScript", "Supabase"].map((tech) => (
              <div
                key={tech}
                style={{
                  fontSize: 13,
                  color: "#71717a",
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: 8,
                  padding: "6px 14px",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #10b981 0%, #059669 50%, transparent 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
