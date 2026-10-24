import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} : Full-Stack Developer Portfolio`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#171613",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "#F5F0E8",
          border: "8px solid #34312B",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                backgroundColor: "#201E1A",
                border: "2px solid #34312B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E7431B",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              {profile.initials}
            </div>
            <span style={{ fontSize: "20px", color: "#A6A197", letterSpacing: "2px" }}>
              PORTFOLIO // 2026
            </span>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(240, 100, 63, 0.12)",
              border: "1px solid #F0643F",
              color: "#F0643F",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {profile.status}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#F5F0E8",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {profile.name}
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "#A6A197",
              margin: 0,
              maxWidth: "850px",
            }}
          >
            Full-stack web engineering, typed APIs, and accessible interface systems.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #34312B",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            {["Next.js", "TypeScript", "React", "Node.js"].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  backgroundColor: "#201E1A",
                  border: "1px solid #34312B",
                  color: "#A6A197",
                  fontSize: "16px",
                }}
              >
                {tech}
              </div>
            ))}
          </div>

          <span style={{ color: "#F0643F", fontSize: "18px", fontWeight: "bold" }}>
            Surat, Gujarat, India
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
