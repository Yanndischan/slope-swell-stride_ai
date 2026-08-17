import React, { useState } from "react";

export function ChatInput({ onSend, disabled = false, placeholder = "Ask about gear, recommendations, or sizing..." }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      if (onSend) onSend(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 bg-slate-900 border-t border-slate-800">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition"
      >
        Send
      </button>
    </form>
  );
}

export default ChatInput;
