import { ImageResponse } from "next/og";
import { GrowthlyMark } from "@/components/GrowthlyMark";

export const alt = "GROWTHLY — Helping Businesses Scale Up.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "#fbfcfa",
          color: "#101820",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", width: "760px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <GrowthlyMark size={44} id="og-small" />
            <div
              style={{
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "4px",
              }}
            >
              GROWTHLY
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "49px",
              color: "#08714d",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "3px",
            }}
          >
            HELPING BUSINESSES SCALE UP
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "18px",
              fontSize: "58px",
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1.12,
            }}
          >
            More than social media.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "8px",
              fontSize: "58px",
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1.12,
              color: "#0f9d6b",
            }}
          >
            Your next step online.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "25px",
              color: "#5f6b66",
              fontSize: "20px",
            }}
          >
            Professional websites for Nigerian businesses.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "170px",
            height: "170px",
            borderRadius: "85px",
            alignItems: "center",
            justifyContent: "center",
            background: "#ddf5e9",
          }}
        >
          <GrowthlyMark size={96} id="og-large" />
        </div>
      </div>
    ),
    { ...size },
  );
}
