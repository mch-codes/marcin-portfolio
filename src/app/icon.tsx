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
          // Deliberately unringed: on the usual white tab strip the disc has no
          // visible edge and the mark reads as two floating letters. The fill
          // is still opaque, so it holds up on a dark tab strip too.
          background: "#ffffff",
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
