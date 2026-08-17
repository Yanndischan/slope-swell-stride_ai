import React from "react";

export function MessageBubble({ message, role = "assistant", content, timestamp, className = "" }) {
  const text = typeof message === "string" ? message : (message?.content || content || "");
  const isUser = (message?.role || role) === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} my-2.5 ${className}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm shadow-md"
            : "bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-sm shadow"
        }`}
      >
        <div className="whitespace-pre-wrap">{text}</div>
        {(timestamp || message?.timestamp) && (
          <span className="mt-1 block text-[10px] opacity-60 text-right">
            {timestamp || message?.timestamp}
          </span>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
