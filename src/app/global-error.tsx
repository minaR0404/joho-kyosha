"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "1rem",
          }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#e5e7eb" }}>
            500
          </h1>
          <h2 style={{ marginTop: "1rem", fontSize: "1.25rem", fontWeight: 600, color: "#374151" }}>
            エラーが発生しました
          </h2>
          <p style={{ marginTop: "0.5rem", color: "#6b7280", textAlign: "center" }}>
            申し訳ありません。しばらくしてからもう一度お試しください。
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.5rem 1.5rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            もう一度試す
          </button>
        </div>
      </body>
    </html>
  );
}
