import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X, Bot, Sparkles, Terminal } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "bot",
      text: "Welcome to Mintor AI Doubts Classroom! Ask me any technical electrician formula, practical, or quiz question.",
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText("");

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await resp.json();

      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: "Brief connection flicker. Please log your API secrets or retry search.",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 font-sans">
      <AnimatePresence>
        
        {/* Floating Chat Panel */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            className="w-80 h-[450px] md:w-96 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.03] flex items-center justify-between relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10" />
              <div className="flex items-center gap-2.5 relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">Mintor AI assistant</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Hologram active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-white/5 active:scale-95 transition-all cursor-pointer relative"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs font-mono leading-relaxed relative ${
                      m.sender === "user"
                        ? "bg-cyan-500 text-black rounded-tr-none shadow-[w-full_5px_15px_rgba(6,182,212,0.15)]"
                        : "bg-white/[0.04] text-slate-100 border border-white/5 rounded-tl-none"
                    }`}
                  >
                    {!m.text.includes("\n") ? (
                      <p>{m.text}</p>
                    ) : (
                      <div className="space-y-1 text-slate-300">
                        {m.text.split("\n").map((line, idx) => {
                          if (line.startsWith("###")) {
                            return <h5 key={idx} className="font-bold text-cyan-400 mt-2 mb-1">{line.replace("###", "")}</h5>;
                          }
                          return <p key={idx}>{line}</p>;
                        })}
                      </div>
                    )}
                    <div className="text-[8px] opacity-40 text-right mt-1.5">
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span className="font-mono text-[10px] uppercase">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Micro Suggestions */}
            <div className="px-3 pb-1 flex gap-1.5 overflow-x-auto select-none no-scrollbar">
              <button
                onClick={() => handleSendMessage("Differentiate Class A and Class D fires.")}
                className="shrink-0 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-full px-2.5 py-1 text-[9px] font-mono text-cyan-400/95"
              >
                🔥 Class A vs D
              </button>
              <button
                onClick={() => handleSendMessage("Ohm's Law formula explanation")}
                className="shrink-0 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-full px-2.5 py-1 text-[9px] font-mono text-purple-400/95"
              >
                🔌 Ohm's Law
              </button>
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-white/5 bg-black/40 flex gap-2">
              <input
                type="text"
                placeholder="Ask technical electrician doubt..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-600"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Spark Balloon */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-shadow cursor-pointer border border-white/10"
      >
        <MessageSquare className="w-5 h-5 text-black" />
      </motion.button>
    </div>
  );
}
