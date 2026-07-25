import { ImageResponse } from "next/og";

export const alt = "Marcin Chrzuszcz — Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const siteHost = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://marcin-portfolio-mocha.vercel.app").replace("https://", "");

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#ffffff",
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
              background: "#f4f4f5",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #d4d4d8",
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: "#047857" }}>MC</span>
          </div>
          <span style={{ fontSize: 14, color: "#6b7280", letterSpacing: 2 }}>
            {siteHost}
          </span>
        </div>

        {/* Center: name + title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#1e1e1e", lineHeight: 1.05, letterSpacing: -2 }}>
            Marcin Chrzuszcz
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              background: "linear-gradient(135deg, #047857, #059669)",
              color: "#047857",
              letterSpacing: -0.5,
            }}
          >
            Web Developer
          </div>
        </div>

        {/* Bottom: location + stack */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, color: "#6b7280" }}>📍</span>
            <span style={{ fontSize: 16, color: "#6b7280" }}>Madrid, Spain</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["JavaScript", "HTML", "CSS"].map((tech) => (
              <div
                key={tech}
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  background: "#f4f4f5",
                  border: "1px solid #d4d4d8",
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
            background: "linear-gradient(90deg, #047857 0%, #059669 50%, transparent 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
