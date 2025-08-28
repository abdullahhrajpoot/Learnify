// // app/student/ai-tutor/page.tsx
// "use client";
// import React, { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import ChatMessage from "@/components/ChatMessage";
// import ChatInput from "@/components/ChatInput";

// type Message = { role: "user" | "assistant", text: string, ts?: string };

// export default function StudentAiTutorPage() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [studentId, setStudentId] = useState<string | null>(null);
//   const [conversationId, setConversationId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState<string | null>(null);

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       const {
//         data: { user },
//         error: userErr
//       } = await supabase.auth.getUser();
//       if (userErr || !user) {
//         setStatus("Not signed in");
//         setLoading(false);
//         return;
//       }
//       setStudentId(user.id);

//       // fetch last conversation if any
//       try {
//         const { data, error } = await supabase
//           .from("ai_conversations")
//           .select("id, title, messages")
//           .eq("student_id", user.id)
//           .order("updated_at", { ascending: false })
//           .limit(1)
//           .single();

//         if (!error && data) {
//           setConversationId(data.id);
//           setMessages((data.messages || []).map((m: any) => ({ role: m.role, text: m.text, ts: m.ts })));
//         }
//       } catch (err) {
//         // ignore
//       } finally {
//         setLoading(false);
//       }
//     };

//     init();
//   }, []);

//   const sendMessage = async (text: string) => {
//     if (!studentId) {
//       alert("Not authenticated");
//       return;
//     }

//     // optimistic UI: append user message
//     const userMsg: Message = { role: "user", text, ts: new Date().toISOString() };
//     setMessages((m) => [...m, userMsg]);
//     setStatus("Thinking...");

//     try {
//       const res = await fetch("/api/ai/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ conversationId, studentId, message: text }),
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json?.error || "LLM error");

//       const assistantText = json.reply ?? "(no reply)";
//       const assistantMsg: Message = { role: "assistant", text: assistantText, ts: new Date().toISOString() };
//       // append assistant
//       setMessages((m) => [...m, assistantMsg]);
//       if (json.conversationId) setConversationId(json.conversationId);
//     } catch (err: any) {
//       console.error("Chat error", err);
//       setMessages((m) => [...m, { role: "assistant", text: "Sorry, something went wrong.", ts: new Date().toISOString() }]);
//     } finally {
//       setStatus(null);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-4">AI Tutor</h1>
//       <p className="text-sm text-gray-600 mb-4">Ask questions, get explanations, practice. (Powered by your chosen LLM)</p>

//       <div className="border rounded p-4 mb-4 min-h-[300px] flex flex-col">
//         {loading ? (
//           <div className="text-gray-600">Loading conversation…</div>
//         ) : (
//           <div className="flex-1 overflow-auto mb-4">
//             {messages.length === 0 ? (
//               <div className="text-gray-500">Say hello — ask your first question.</div>
//             ) : (
//               messages.map((m, i) => <ChatMessage key={i} role={m.role} text={m.text} />)
//             )}
//           </div>
//         )}

//         <div>
//           <ChatInput onSend={sendMessage} />
//           {status && <div className="text-sm mt-2 text-gray-500">{status}</div>}
//         </div>
//       </div>
//     </div>
//   );
// }





// app/student/ai-tutor/page.tsx
// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import ChatMessage from "@/components/ChatMessage";
// import ChatInput from "@/components/ChatInput";

// type Message = { role: "user" | "assistant"; text: string; ts?: string };

// export default function StudentAiTutorPage() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [studentId, setStudentId] = useState<string | null>(null);
//   const [conversationId, setConversationId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState<string | null>(null);

//   // ref for auto-scroll
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       const {
//         data: { user },
//         error: userErr,
//       } = await supabase.auth.getUser();
//       if (userErr || !user) {
//         setStatus("Not signed in");
//         setLoading(false);
//         return;
//       }
//       setStudentId(user.id);

//       // fetch last conversation if any
//       try {
//         const { data, error } = await supabase
//           .from("ai_conversations")
//           .select("id, title, messages")
//           .eq("student_id", user.id)
//           .order("updated_at", { ascending: false })
//           .limit(1)
//           .single();

//         if (!error && data) {
//           setConversationId(data.id);
//           setMessages(
//             (data.messages || []).map((m: any) => ({
//               role: m.role,
//               text: m.text,
//               ts: m.ts,
//             }))
//           );
//         }
//       } catch (err) {
//         // ignore
//       } finally {
//         setLoading(false);
//       }
//     };

//     init();
//   }, []);

//   // Auto-scroll when messages change
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const sendMessage = async (text: string) => {
//     if (!studentId) {
//       alert("Not authenticated");
//       return;
//     }

//     // optimistic UI: append user message
//     const userMsg: Message = {
//       role: "user",
//       text,
//       ts: new Date().toISOString(),
//     };
//     setMessages((m) => [...m, userMsg]);
//     setStatus("Thinking...");

//     try {
//       const res = await fetch("/api/ai/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ conversationId, studentId, message: text }),
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json?.error || "LLM error");

//       const assistantText = json.reply ?? "(no reply)";
//       const assistantMsg: Message = {
//         role: "assistant",
//         text: assistantText,
//         ts: new Date().toISOString(),
//       };
//       // append assistant
//       setMessages((m) => [...m, assistantMsg]);
//       if (json.conversationId) setConversationId(json.conversationId);
//     } catch (err: any) {
//       console.error("Chat error", err);
//       setMessages((m) => [
//         ...m,
//         {
//           role: "assistant",
//           text: "Sorry, something went wrong.",
//           ts: new Date().toISOString(),
//         },
//       ]);
//     } finally {
//       setStatus(null);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-4">AI Tutor</h1>
//       <p className="text-sm text-gray-600 mb-4">
//         Ask questions, get explanations, practice. (Powered by your chosen LLM)
//       </p>

//       <div className="border rounded p-4 mb-4 min-h-[300px] flex flex-col">
//         {loading ? (
//           <div className="text-gray-600">Loading conversation…</div>
//         ) : (
//           <div className="flex-1 overflow-y-auto mb-4 max-h-[400px] pr-2">
//             {messages.length === 0 ? (
//               <div className="text-gray-500">
//                 Say hello — ask your first question.
//               </div>
//             ) : (
//               <>
//                 {messages.map((m, i) => (
//                   <ChatMessage key={i} role={m.role} text={m.text} />
//                 ))}
//                 {/* dummy div for auto-scroll */}
//                 <div ref={messagesEndRef} />
//               </>
//             )}
//           </div>
//         )}

//         <div>
//           <ChatInput onSend={sendMessage} />
//           {status && <div className="text-sm mt-2 text-gray-500">{status}</div>}
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { motion } from "framer-motion";

type Message = { role: "user" | "assistant"; text: string; ts?: string };

export default function StudentAiTutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        setStatus("Not signed in");
        setLoading(false);
        return;
      }
      setStudentId(user.id);

      try {
        const { data, error } = await supabase
          .from("ai_conversations")
          .select("id, title, messages")
          .eq("student_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          setConversationId(data.id);
          setMessages(
            (data.messages || []).map((m: any) => ({
              role: m.role,
              text: m.text,
              ts: m.ts,
            }))
          );
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!studentId) {
      alert("Not authenticated");
      return;
    }

    const userMsg: Message = { role: "user", text, ts: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setStatus("Thinking...");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, studentId, message: text }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "LLM error");

      const assistantMsg: Message = {
        role: "assistant",
        text: json.reply ?? "(no reply)",
        ts: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistantMsg]);
      if (json.conversationId) setConversationId(json.conversationId);
    } catch (err) {
      console.error("Chat error", err);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Sorry, something went wrong.", ts: new Date().toISOString() },
      ]);
    } finally {
      setStatus(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-blue-600 text-center mb-2"
      >
        AI Tutor
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-gray-600 text-center mb-6"
      >
        Ask questions, get explanations, practice. Powered by your personal AI assistant.
      </motion.p>

      <div className="border rounded-xl shadow-lg p-4 flex flex-col h-[500px] bg-white">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">Loading conversation…</div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4 pr-2">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-center mt-24"
              >
                Say hello — ask your first question.
              </motion.div>
            ) : (
              messages.map((m, i) => (
                <ChatMessage
                  key={i}
                  role={m.role}
                  text={m.text}
                  className={m.role === "user" ? "bg-blue-50" : "bg-gray-100"}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="mt-auto">
          <ChatInput onSend={sendMessage} />
          {status && <div className="text-sm mt-2 text-gray-500 text-center">{status}</div>}
        </div>
      </div>
    </div>
  );
}
