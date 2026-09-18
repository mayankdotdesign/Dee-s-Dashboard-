import { ImageResponse } from "next/og";

export const alt = "Dee's Dashboard — Hey Deeksha";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mirrors the /login screen (dark mode palette from globals.css, hex values
// resolved since Satori can't parse oklch()) — the password gate is the
// first thing anyone following the link sees, so it doubles as an honest
// "this is private" signal in the link preview itself.
export default function OpengraphImage() {
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
          backgroundColor: "#1d140f",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 88, lineHeight: 1, marginBottom: 28 }}>🌻</div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#f9f4ee",
            marginBottom: 16,
          }}
        >
          Hey Deeksha
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#dcd2ca",
            fontFamily: "sans-serif",
            marginBottom: 48,
          }}
        >
          Enter the password to see your dashboard.
        </div>
        <div
          style={{
            display: "flex",
            width: 420,
            height: 56,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.15)",
            backgroundColor: "#2f231e",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: "#dcd2ca",
            fontFamily: "sans-serif",
            marginBottom: 16,
          }}
        >
          Password
        </div>
        <div
          style={{
            display: "flex",
            width: 420,
            height: 56,
            borderRadius: 14,
            backgroundColor: "#e88761",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 600,
            color: "#1d140f",
            fontFamily: "sans-serif",
          }}
        >
          Enter
        </div>
      </div>
    ),
    { ...size },
  );
}
