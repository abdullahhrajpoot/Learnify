// app/api/ai/chat/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL ?? "deepseek/deepseek-r1:free";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).");
}
if (!OPENROUTER_API_KEY) {
  console.warn("OPENROUTER_API_KEY not set — route will fail when calling OpenRouter.");
}

const supabaseSvc = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// helper: call OpenRouter chat completions
async function callOpenRouter(messages: { role: string; content: string }[]) {
  const url = "https://openrouter.ai/api/v1/chat/completions";
  const body = {
    model: OPENROUTER_MODEL,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    // you can tweak params here:
    temperature: 0.2,
    max_tokens: 800,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      // optional headers from their snippet:
      // "HTTP-Referer": "<YOUR_SITE_URL>",
      // "X-Title": "<YOUR_SITE_NAME>",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    // include response text for easier debugging
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  // parse response JSON
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw new Error("OpenRouter returned invalid JSON: " + text);
  }

  // Try a few paths to extract assistant text (robust)
  const choice = json?.choices?.[0];
  const assistant =
    choice?.message?.content ??
    choice?.message?.content?.[0]?.text ??
    choice?.text ??
    // some providers put content in other fields; try some common fallbacks
    json?.output?.[0]?.content?.[0]?.text ??
    json?.results?.[0]?.message?.content ??
    null;

  if (!assistant) {
    // If we couldn't find a textual reply, return stringified JSON for debugging
    return JSON.stringify(json);
  }

  return assistant;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { conversationId, studentId, message } = body ?? {};

    if (!studentId || !message) {
      return NextResponse.json({ error: "studentId and message are required." }, { status: 400 });
    }

    // Build message history — fetch existing conversation messages if conversationId provided
    let messages: { role: string; content: string }[] = [];

    if (conversationId) {
      const { data: conv, error: convErr } = await supabaseSvc
        .from("ai_conversations")
        .select("messages, title")
        .eq("id", conversationId)
        .single();

      if (convErr) {
        // If conv not found, we'll start a new one; otherwise log for debugging
        console.warn("Conversation fetch error (may be new):", convErr);
      } else if (conv?.messages) {
        // our DB stores messages as array of {role, text, ts}
        messages = Array.isArray(conv.messages)
          ? conv.messages.map((m: any) => ({ role: m.role, content: m.text }))
          : [];
      }
    }

    // append user message
    messages.push({ role: "user", content: message });

    // 1) Call OpenRouter
    const replyText = await callOpenRouter(messages);

    // append assistant message locally
    messages.push({ role: "assistant", content: replyText });

    // 2) Store/update conversation server-side with service role
    if (conversationId) {
      // Overwrite messages with the new array of {role, text, ts}
      const newMessages = messages.map((m) => ({ role: m.role, text: m.content, ts: new Date().toISOString() }));
      const { error: updateErr } = await supabaseSvc
        .from("ai_conversations")
        .update({ messages: newMessages })
        .eq("id", conversationId);
      if (updateErr) {
        console.error("Failed to update conversation:", updateErr);
      }
    } else {
      // create new conversation row
      const convTitle = message.slice(0, 80);
      const newMessages = messages.map((m) => ({ role: m.role, text: m.content, ts: new Date().toISOString() }));
      const { data: created, error: createErr } = await supabaseSvc
        .from("ai_conversations")
        .insert([{ student_id: studentId, title: convTitle, messages: newMessages }])
        .select()
        .single();
      if (createErr) {
        console.error("Failed creating conversation:", createErr);
      } else {
        conversationId = created.id;
      }
    }

    return NextResponse.json({
      ok: true,
      reply: replyText,
      conversationId: conversationId ?? null,
    });
  } catch (err: any) {
    console.error("/api/ai/chat error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
