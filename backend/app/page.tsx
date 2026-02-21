export default function Home() {
  return (
    <main style={{ padding: "48px", fontFamily: "system-ui, sans-serif", maxWidth: "600px" }}>
      <h1 style={{ marginBottom: "8px" }}>Page Simplifier API</h1>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>
        AI-powered webpage transformation backend.
      </p>
      <code
        style={{
          display: "block",
          background: "#f1f5f9",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        POST /api/transform
        <br />
        {"{ title, url, content }"}
      </code>
    </main>
  );
}
