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
          // White fill on a browser tab that is itself usually white, so the
          // disc needs the ring to have an edge at all — without it the mark
          // reads as two floating letters.
          background: "#ffffff",
          border: "2px solid #000000",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#000000",
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
