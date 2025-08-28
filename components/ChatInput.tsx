// components/ChatInput.tsx
"use client";
import React, { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (text: string) => Promise<void> }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error , setError] = useState("");

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim())
    {
        setError("Please enter something!!!!!");
     return;}
     setError("");
    setText("");
    setBusy(true);
    await onSend(text.trim());
    
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={error || "Ask the AI tutor"}
        className="flex-1 p-3 border rounded"
      />
      <button type="submit" disabled={busy} className="px-4 py-2 bg-slate-800 text-white rounded">
        {busy ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
