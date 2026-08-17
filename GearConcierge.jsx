const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Sparkles } from "lucide-react";

import MessageBubble from "@/components/agent/MessageBubble";
import ThemeToggle from "@/components/ThemeToggle";

const SUGGESTIONS = [
  "What premium gear should I rent for my next surf trip?",
  "Recommend ski rentals based on my activity history",
  "I'm planning a trail running weekend — what should I rent?",
];

export default function GearConcierge() {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(true);
  const scrollRef = useRef(null);
  const loadingTimer = useRef(null);

  useEffect(() => {
    let unsubscribe = () => {};
    (async () => {
      try {
        const conv = await db.agents.createConversation({
          agent_name: "gear_concierge",
          metadata: { name: "Gear Concierge" },
        });
        setConversation(conv);
        setMessages(conv.messages || []);
        setCreating(false);
        unsubscribe = db.agents.subscribeToConversation(conv.id, (data) => {
          try {
            const msgs = data?.messages || [];
            setMessages(msgs);
            const lastMsg = msgs[msgs.length - 1];
            if (
              lastMsg &&
              lastMsg.role === "assistant" &&
              lastMsg.content &&
              (!lastMsg.tool_calls ||
                lastMsg.tool_calls.length === 0 ||
                !lastMsg.tool_calls.some(
                  (tc) =>
                    tc.status === "pending" ||
                    tc.status === "running" ||
                    tc.status === "in_progress"
                ))
            ) {
              setLoading(false);
              if (loadingTimer.current) clearTimeout(loadingTimer.current);
            }
          } catch (err) {
            console.error("Subscription error:", err);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Failed to create conversation:", err);
        setCreating(false);
      }
    })();
    return () => {
      unsubscribe();
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async (text) => {
    const content = (text || input).trim();
    if (!content || !conversation || loading) return;
    setInput("");
    setLoading(true);
    if (loadingTimer.current) clearTimeout(loadingTimer.current);
    loadingTimer.current = setTimeout(() => setLoading(false), 45000);
    try {
      const updated = await db.agents.addMessage(conversation, {
        role: "user",
        content,
      });
      setConversation(updated);
      setMessages(updated.messages || []);
    } catch (err) {
      console.error("Failed to send message:", err);
      setLoading(false);
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
    }
  };

  const visibleMessages = messages.filter(
    (msg) => msg.role === "user" || !msg.tool_calls || msg.tool_calls.length === 0
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      {/* Ambient glow */}
      <div
        className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[200px] opacity-[0.06] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between px-6 md:px-12 py-5 border-b border-border z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold font-heading text-foreground">
              Gear Concierge
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto px-6 md:px-12 py-8 max-w-3xl mx-auto w-full z-10"
      >
        {creating ? (
          <div className="text-center text-muted-foreground text-sm py-20">
            Connecting to your gear concierge…
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xl font-heading text-foreground mb-2">
              Premium gear, personally picked.
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
              Tell me about your next trip and I'll suggest the right rental gear
              based on your activity history.
            </p>
            <div className="flex flex-col items-center gap-2 max-w-sm mx-auto">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/30 transition-all text-sm text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleMessages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="relative border-t border-border px-6 md:px-12 py-4 max-w-3xl mx-auto w-full z-10">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 focus-within:border-primary/40 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about gear for your next adventure…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}