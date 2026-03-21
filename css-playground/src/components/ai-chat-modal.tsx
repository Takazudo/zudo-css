import { useState, useRef, useEffect, useCallback } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AiChatModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Listen for toggle event
  useEffect(() => {
    const handler = () => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (dialog.open) {
        dialog.close();
      } else {
        dialog.showModal();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("toggle-ai-chat", handler);
    return () => window.removeEventListener("toggle-ai-chat", handler);
  }, []);

  // Clear history on close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      abortRef.current?.abort();
      abortRef.current = null;
      setMessages([]);
      setInput("");
      setError(null);
      setLoading(false);
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  // Backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      dialog.close();
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setError(null);
    setLoading(true);
    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: messages }),
        signal: abort.signal,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let msg = `Server error ${res.status}`;
        try {
          const data = JSON.parse(text);
          if (data.error) msg = data.error;
        } catch {
          // non-JSON response
        }
        setError(msg);
      } else {
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setMessages([
            ...newMessages,
            { role: "assistant", content: data.response },
          ]);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
      if (abortRef.current === abort) abortRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-label="AI Chat"
      className="w-[90vw] h-[90vh] max-w-[700px] m-auto p-0 rounded-lg border border-muted/30 bg-bg text-fg backdrop:bg-p0/70"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-hsp-md py-vsp-xs bg-surface border-b border-muted/20">
          <span className="text-subheading font-semibold">AI Chat</span>
          <button
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="text-muted hover:text-fg text-body bg-transparent border-none cursor-pointer px-hsp-xs"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-hsp-md space-y-vsp-sm">
          {messages.length === 0 && (
            <p className="text-small text-muted text-center mt-vsp-xl">
              Ask the AI to generate CSS component patterns using design tokens.
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-hsp-md py-vsp-xs rounded-lg text-small whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-accent/20 text-fg"
                    : "bg-surface text-fg"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface px-hsp-md py-vsp-xs rounded-lg text-small text-muted">
                <span className="inline-block animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="bg-danger/15 text-danger px-hsp-md py-vsp-xs rounded-lg text-small">
                {error}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-muted/20 bg-surface px-hsp-md py-vsp-xs flex gap-hsp-sm">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for a component pattern..."
            disabled={loading}
            className="flex-1 bg-bg border border-muted/30 rounded px-hsp-sm py-vsp-2xs text-small text-fg placeholder:text-muted outline-none focus:border-accent"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-accent text-bg px-hsp-lg py-vsp-2xs rounded text-small font-medium cursor-pointer border-none hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </dialog>
  );
}
