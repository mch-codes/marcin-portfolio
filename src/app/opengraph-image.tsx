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
          background: "#0d0b08",
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
              background: "#1c1916",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #302b22",
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: "#e8956d" }}>MC</span>
          </div>
          <span style={{ fontSize: 14, color: "#7d7063", letterSpacing: 2 }}>
            marcin-portfolio.vercel.app
          </span>
        </div>

        {/* Center: name + title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#ede8e0", lineHeight: 1.05, letterSpacing: -2 }}>
            Marcin Chrzuszcz
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              background: "linear-gradient(135deg, #e8956d, #c8a96e)",
              color: "#e8956d",
              letterSpacing: -0.5,
            }}
          >
            Fullstack Developer &amp; ex-Chef
          </div>
        </div>

        {/* Bottom: location + stack */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, color: "#7d7063" }}>📍</span>
            <span style={{ fontSize: 16, color: "#7d7063" }}>Madrid, Spain</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["Next.js", "TypeScript", "Supabase"].map((tech) => (
              <div
                key={tech}
                style={{
                  fontSize: 13,
                  color: "#7d7063",
                  background: "#131110",
                  border: "1px solid #252118",
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
            background: "linear-gradient(90deg, #e8956d 0%, #c8a96e 50%, transparent 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
