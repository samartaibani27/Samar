import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: "#0c1015",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4fb8d6",
          fontWeight: 800,
          borderRadius: 6,
          border: "2px solid #223042",
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
