import React, { useEffect } from "react";

export interface TransformData {
  title: string;
  tldr: string;
  sections: Array<{ heading: string; points: string[] }>;
  keyTakeaways: string[];
  readTime: string;
}

interface Props {
  data: TransformData;
  onRestore: () => void;
}

const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    WebkitFontSmoothing: "antialiased",
    color: "#0f172a",
  },
  topbar: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid #e2e8f0",
    padding: "12px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky" as const,
    top: 0,
    zIndex: 10,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#6366f1",
    fontWeight: 600,
    fontSize: "14px",
  },
  brandLogo: {
    width: "22px",
    height: "22px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "11px",
    fontWeight: 700,
  },
  restoreBtn: {
    background: "none",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    padding: "6px 14px",
    cursor: "pointer",
    color: "#64748b",
    fontSize: "13px",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  content: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "48px 24px 80px",
  },
  readTime: {
    fontSize: "13px",
    color: "#6366f1",
    fontWeight: 600,
    letterSpacing: "0.03em",
    marginBottom: "10px",
    textTransform: "uppercase" as const,
  },
  pageTitle: {
    fontSize: "30px",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.25,
    margin: "0 0 36px",
    letterSpacing: "-0.03em",
  },
  tldrCard: {
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: "12px",
    padding: "20px 24px",
    marginBottom: "44px",
  },
  tldrLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#6366f1",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    marginBottom: "10px",
  },
  tldrText: {
    margin: 0,
    color: "#1e293b",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  sectionHeading: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 14px",
    letterSpacing: "-0.02em",
  },
  ul: {
    margin: "0 0 36px",
    padding: 0,
    listStyle: "none",
  },
  li: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    color: "#334155",
    lineHeight: 1.65,
    marginBottom: "10px",
    fontSize: "15px",
  },
  bullet: {
    color: "#6366f1",
    fontWeight: 700,
    marginTop: "2px",
    flexShrink: 0,
    fontSize: "16px",
  },
  takeawaysCard: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "24px",
    marginTop: "8px",
  },
  takeawaysLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#16a34a",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    marginBottom: "16px",
  },
  takeawayRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "12px",
    fontSize: "15px",
  },
  takeawayCheck: {
    color: "#16a34a",
    fontWeight: 700,
    flexShrink: 0,
    marginTop: "1px",
  },
  takeawayText: {
    color: "#166534",
    lineHeight: 1.6,
  },
  footer: {
    marginTop: "56px",
    paddingTop: "24px",
    borderTop: "1px solid #e2e8f0",
    textAlign: "center" as const,
    color: "#94a3b8",
    fontSize: "13px",
  },
  footerLink: {
    background: "none",
    border: "none",
    color: "#6366f1",
    cursor: "pointer",
    fontSize: "13px",
    padding: 0,
    fontFamily: "inherit",
  },
};

export function TransformedPage({ data, onRestore }: Props) {
  useEffect(() => {
    document.title = `${data.title} — Simplified`;
  }, [data.title]);

  return (
    <div style={s.root}>
      {/* Top bar */}
      <div style={s.topbar}>
        <div style={s.brand}>
          <div style={s.brandLogo}>S</div>
          Page Simplifier
        </div>
        <button style={s.restoreBtn} onClick={onRestore}>
          ← Back to original
        </button>
      </div>

      {/* Main content */}
      <div style={s.content}>
        <div style={s.readTime}>{data.readTime}</div>
        <h1 style={s.pageTitle}>{data.title}</h1>

        {/* TL;DR */}
        <div style={s.tldrCard}>
          <div style={s.tldrLabel}>TL;DR</div>
          <p style={s.tldrText}>{data.tldr}</p>
        </div>

        {/* Sections */}
        {data.sections.map((section, i) => (
          <div key={i}>
            <h2 style={s.sectionHeading}>{section.heading}</h2>
            <ul style={s.ul}>
              {section.points.map((point, j) => (
                <li key={j} style={s.li}>
                  <span style={s.bullet}>·</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Key takeaways */}
        <div style={s.takeawaysCard}>
          <div style={s.takeawaysLabel}>Key Takeaways</div>
          {data.keyTakeaways.map((t, i) => (
            <div key={i} style={s.takeawayRow}>
              <span style={s.takeawayCheck}>✓</span>
              <span style={s.takeawayText}>{t}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={s.footer}>
          Simplified by Page Simplifier ·{" "}
          <button style={s.footerLink} onClick={onRestore}>
            Back to original
          </button>
        </div>
      </div>
    </div>
  );
}
