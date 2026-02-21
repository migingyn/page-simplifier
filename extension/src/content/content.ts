import { createRoot } from "react-dom/client";
import React from "react";
import { TransformedPage, TransformData } from "./TransformedPage";

const API_URL = "http://localhost:3000/api/transform";

let originalHTML: string | null = null;

function restore() {
  if (!originalHTML) return;
  document.documentElement.innerHTML = originalHTML;
  // Re-attach event listeners won't work, but the visual state is restored.
  // For a full restore, reload the page:
  // location.reload();
}

function showLoading() {
  originalHTML = document.documentElement.innerHTML;

  document.head.innerHTML =
    '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">';

  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(style);

  document.body.innerHTML = "";
  document.body.style.cssText = "margin:0;padding:0;";

  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #f8fafc;
    font-family: system-ui, -apple-system, sans-serif;
    animation: fadeIn 0.3s ease;
  `;
  wrapper.innerHTML = `
    <div style="text-align:center">
      <div style="
        width: 40px; height: 40px;
        border: 3px solid #e2e8f0;
        border-top-color: #6366f1;
        border-radius: 50%;
        margin: 0 auto 20px;
        animation: spin 0.75s linear infinite;
      "></div>
      <p style="color:#0f172a;margin:0 0 6px;font-size:16px;font-weight:600">Simplifying page…</p>
      <p style="color:#94a3b8;margin:0;font-size:13px">AI is extracting key ideas</p>
    </div>
  `;
  document.body.appendChild(wrapper);
}

function showError(message: string) {
  document.body.innerHTML = "";
  document.body.style.cssText = "margin:0;padding:0;";

  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #f8fafc;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  wrapper.innerHTML = `
    <div style="text-align:center;max-width:400px;padding:32px">
      <div style="font-size:40px;margin-bottom:16px">⚠️</div>
      <h2 style="color:#0f172a;margin:0 0 10px;font-size:20px;font-weight:700">Something went wrong</h2>
      <p style="color:#64748b;margin:0 0 24px;font-size:14px;line-height:1.6">${message}</p>
      <button onclick="location.reload()" style="
        padding: 10px 24px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        font-family: system-ui, sans-serif;
      ">Reload page</button>
    </div>
  `;
  document.body.appendChild(wrapper);
}

async function transformPage(): Promise<{ success?: boolean; error?: string }> {
  const title = document.title;
  const url = window.location.href;
  const content = document.body.innerText;

  showLoading();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url, content }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `API returned ${response.status}`);
    }

    const data: TransformData = await response.json();

    // Clear and mount React
    document.body.innerHTML = "";
    document.body.style.cssText = "margin:0;padding:0;";

    const container = document.createElement("div");
    container.id = "page-simplifier-root";
    document.body.appendChild(container);

    createRoot(container).render(
      React.createElement(TransformedPage, { data, onRestore: restore })
    );

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    showError(message);
    return { error: message };
  }
}

// Listen for the TRANSFORM message from the popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "TRANSFORM") {
    transformPage().then(sendResponse);
    return true; // keep the channel open for the async response
  }
});
