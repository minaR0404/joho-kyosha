import { ImageResponse } from "next/og";

export const alt = "情報強者 - 騙される前に、まずチェック。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Shield icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>

        {/* Site name */}
        <div
          style={{
            marginTop: 32,
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: "0.05em",
          }}
        >
          情報強者
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            color: "#94a3b8",
            letterSpacing: "0.02em",
          }}
        >
          騙される前に、まずチェック。
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 22,
            color: "#64748b",
          }}
        >
          joho-kyosya.com
        </div>
      </div>
    ),
    { ...size }
  );
}
