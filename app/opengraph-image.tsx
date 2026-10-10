import { ImageResponse } from "next/og";

export const alt = "GROWTHLY — Helping Businesses Scale Up.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function BrandMark({ size: markSize = 44 }: { size?: number }) {
  return (
    <svg width={markSize} height={markSize} viewBox="0 0 40 40" fill="none">
      <rect x="1" y="1" width="38" height="38" rx="12" fill="#0F9D6B" opacity=".12" />
      <path d="M10 25.6c4.1-.1 7.1-2.6 8.2-7.5 4.9.5 8.8-1.7 11.5-6.4 1.1 6.7-.9 13.4-6 17.1-4.1 3-9.4 2.7-13.7-1.4Z" fill="#0F9D6B" />
      <path d="M11 29c4.5-4.3 8.9-8 15.5-13" stroke="#FBFCFA" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

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
        <div style={{ display: "flex", flexDirection: "column", width: "760px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <BrandMark />
            <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "4px" }}>GROWTHLY</div>
          </div>
          <div style={{ display: "flex", marginTop: "49px", color: "#08714d", fontSize: "16px", fontWeight: 700, letterSpacing: "3px" }}>HELPING BUSINESSES SCALE UP</div>
          <div style={{ display: "flex", marginTop: "18px", fontSize: "58px", fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.12 }}>Your business has potential.</div>
          <div style={{ display: "flex", marginTop: "8px", fontSize: "58px", fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.12, color: "#0f9d6b" }}>Let’s help it grow.</div>
          <div style={{ display: "flex", marginTop: "25px", color: "#5f6b66", fontSize: "20px" }}>Design, websites and marketing for growing businesses.</div>
        </div>
        <div style={{ display: "flex", width: "170px", height: "170px", borderRadius: "85px", alignItems: "center", justifyContent: "center", background: "#ddf5e9" }}>
          <BrandMark size={96} />
        </div>
      </div>
    ),
    { ...size },
  );
}
