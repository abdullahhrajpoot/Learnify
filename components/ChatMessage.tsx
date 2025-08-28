// // components/ChatMessage.tsx
// "use client";
// import React from "react";

// export default function ChatMessage({ role, text }: { role: "user" | "assistant", text: string }) {
//   const isUser = role === "user";
//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
//       <div className={`${isUser ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-900"} max-w-[80%] p-3 rounded-md`}>
//         <div className="text-sm whitespace-pre-wrap">{text}</div>
//         <div className="text-xs text-gray-400 mt-1">{isUser ? "You" : "AI Tutor"}</div>
//       </div>
//     </div>
//   );
// }



// components/ChatMessage.tsx
"use client";
import React from "react";

type ChatMessageProps = {
  role: "user" | "assistant";
  text: string;
  className?: string; // <- added for extra styling
};

export default function ChatMessage({ role, text, className }: ChatMessageProps) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] p-3 rounded-md ${
          isUser ? "bg-slate-800 text-white" : "bg-gray-100 text-gray-900"
        } ${className || ""}`} // merge className
      >
        <div className="text-sm whitespace-pre-wrap">{text}</div>
        <div className="text-xs text-gray-400 mt-1">{isUser ? "You" : "AI Tutor"}</div>
      </div>
    </div>
  );
}
