export const prerender = false;

import type { APIRoute } from "astro";
import { spawn } from "node:child_process";

// Simple in-flight request guard — only 1 concurrent claude process
let inFlight = false;

const SYSTEM_PROMPT = `You are a CSS Playground AI assistant. You generate UI component variations using strict design tokens.

When generating HTML+CSS patterns, you MUST use these CSS custom property tokens:
- Spacing: --space-xs (8px), --space-sm (12px), --space-md (20px), --space-lg (32px)
- Colors: --accent, --accent-hover, --fg, --fg-muted, --bg, --bg-subtle, --border, --success, --danger, --warning, --info
- Typography: --font-sm (0.85rem), --font-md (1rem), --font-lg (1.1rem)
- Border radius: --radius (8px)
- Font family: font-family: system-ui, sans-serif

NEVER use arbitrary hex colors or pixel values. Every value must come from a token variable.
Use BEM-ish class names. CSS-only interactions (no JavaScript).
Each pattern must be self-contained HTML+CSS that works in an iframe.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_HISTORY_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 4000;
const JSON_HEADERS = { "Content-Type": "application/json" };

function jsonResponse(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }
  const { message, history } = body;

  if (typeof message !== "string" || !message.trim()) {
    return jsonResponse({ error: "message required" }, 400);
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ error: "message too long" }, 400);
  }

  const validHistory = (Array.isArray(history) ? history : [])
    .filter(
      (h: unknown): h is ChatMessage =>
        typeof h === "object" &&
        h !== null &&
        "role" in h &&
        "content" in h &&
        ((h as ChatMessage).role === "user" ||
          (h as ChatMessage).role === "assistant") &&
        typeof (h as ChatMessage).content === "string" &&
        (h as ChatMessage).content.length <= MAX_MESSAGE_LENGTH,
    )
    .slice(-MAX_HISTORY_LENGTH);

  const contextLines = validHistory.map((h: ChatMessage) =>
    `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`,
  );
  contextLines.push(`User: ${message}`);
  const fullPrompt = contextLines.join("\n\n");

  if (inFlight) {
    return jsonResponse({ error: "Another request is in progress. Please wait." }, 429);
  }

  inFlight = true;
  try {
    const response = await callClaude(fullPrompt);
    return jsonResponse({ response });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "AI request failed" },
      500,
    );
  } finally {
    inFlight = false;
  }
};

async function callClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "claude",
      [
        "-p",
        "--model",
        "haiku",
        "--max-budget-usd",
        "0.50",
        "--system-prompt",
        SYSTEM_PROMPT,
      ],
      { stdio: ["pipe", "pipe", "pipe"] },
    );

    proc.stdin.write(prompt);
    proc.stdin.end();

    let output = "";
    let error = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        proc.kill();
        reject(new Error("Timeout after 60s"));
      }
    }, 60_000);

    proc.stdout.on("data", (d: Buffer) => {
      output += d.toString();
    });
    proc.stderr.on("data", (d: Buffer) => {
      error += d.toString();
    });
    proc.on("error", (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error(`Spawn failed: ${err.message}`));
      }
    });
    proc.on("close", (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        if (code === 0) resolve(output.trim());
        else reject(new Error(`claude exited ${code}: ${error}`));
      }
    });
  });
}
