import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 90,
          background: "#0c1015",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4fb8d6",
          fontWeight: 800,
          borderRadius: 36,
          border: "8px solid #223042",
          fontFamily: "sans-serif",
        }}
      >
        TS
      </div>
    ),
    {
      ...size,
    }
  );
}
