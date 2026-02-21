import React, { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "300px",
    padding: "24px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    background: "white",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
  },
  logo: {
    width: "28px",
    height: "28px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "14px",
    fontWeight: "700",
    flexShrink: 0,
  },
  title: {
    fontWeight: 700,
    fontSize: "15px",
    color: "#0f172a",
  },
  button: {
    width: "100%",
    padding: "14px",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
    letterSpacing: "-0.01em",
  },
  hint: {
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "14px",
    textAlign: "center",
    lineHeight: 1.5,
  },
  error: {
    color: "#ef4444",
    fontSize: "13px",
    marginTop: "12px",
    textAlign: "center",
    lineHeight: 1.4,
  },
};

export function Popup() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSimplify = async () => {
    if (status === "loading" || status === "done") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) throw new Error("No active tab found.");

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: "TRANSFORM",
      });

      if (response?.error) throw new Error(response.error);

      setStatus("done");
      setTimeout(() => window.close(), 800);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";
      setErrorMsg(
        msg.includes("Could not establish connection")
          ? "Reload the page and try again."
          : msg
      );
      setStatus("error");
    }
  };

  const buttonColors: Record<Status, string> = {
    idle: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    loading: "linear-gradient(135deg, #818cf8, #a78bfa)",
    done: "linear-gradient(135deg, #16a34a, #15803d)",
    error: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  };

  const buttonLabels: Record<Status, string> = {
    idle: "✦  Simplify this page",
    loading: "Simplifying…",
    done: "✓  Done!",
    error: "✦  Try again",
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>S</div>
        <span style={styles.title}>Page Simplifier</span>
      </div>

      <button
        onClick={handleSimplify}
        style={{
          ...styles.button,
          background: buttonColors[status],
          opacity: status === "loading" ? 0.85 : 1,
          cursor: status === "loading" || status === "done" ? "default" : "pointer",
        }}
      >
        {buttonLabels[status]}
      </button>

      {status === "error" && errorMsg && (
        <p style={styles.error}>{errorMsg}</p>
      )}

      {status === "idle" && (
        <p style={styles.hint}>
          Transforms the current page into a clean, AI-summarized reading view.
        </p>
      )}
    </div>
  );
}
