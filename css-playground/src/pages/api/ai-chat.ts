export const prerender = false;

import type { APIRoute } from "astro";
import { spawn } from "node:child_process";

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

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { message, history } = body;

  if (typeof message !== "string" || !message.trim()) {
    return new Response(JSON.stringify({ error: "message required" }), {
      status: 400,
    });
  }

  const contextLines = (history || []).map((h: ChatMessage) =>
    `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`,
  );
  contextLines.push(`User: ${message}`);
  const fullPrompt = contextLines.join("\n\n");

  try {
    const response = await callClaude(fullPrompt);
    return new Response(JSON.stringify({ response }));
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "AI request failed",
      }),
      { status: 500 },
    );
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
