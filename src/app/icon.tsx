import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0d0b08",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#e8956d",
            letterSpacing: "-0.5px",
            fontFamily: "sans-serif",
          }}
        >
          MC
        </span>
      </div>
    ),
    { ...size }
  );
}
