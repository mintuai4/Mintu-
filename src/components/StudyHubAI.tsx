import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Send, Brain, Compass, BookOpen, Clock, 
  HelpCircle, GraduationCap, Award, ChevronRight, CheckCircle2 
} from "lucide-react";

interface ActiveChapter {
  title: string;
  description: string;
  notes: string;
  mcqs: { question: string; options: string[]; answerIndex: number; explanation: string }[];
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  isRecommendation?: boolean;
}

interface StudyHubAIProps {
  profile: any;
  activeChapter: ActiveChapter | null;
  selectedSubjectName: string;
  onEarnXP: (xp: number) => void;
}

export default function StudyHubAI({ profile, activeChapter, selectedSubjectName, onEarnXP }: StudyHubAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-tutor",
      sender: "bot",
      text: `Hello ${profile?.name || "Electrician Apprentice"}! I am your dedicated **Mintor AI Study Copilot**.

I have read your profile, including your interests: **${profile?.interests?.join(", ") || "General Electrician Theory"}**, and your cumulative rating of **${profile?.xp || 0} XP** inside your ${profile?.streak || 1}-day active streak.

**What would you like me to do?** You can ask me any technical doubts, click the quick assist buttons below to get personalized recommendations, or ask me to unpack the current lesson!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string, isRec = false) => {
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
      const resp = await fetch("/api/study-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          activeChapter: activeChapter ? {
            title: activeChapter.title,
            description: activeChapter.description,
            notes: activeChapter.notes
          } : null,
          subjectName: selectedSubjectName,
          profile: {
            name: profile?.name,
            interests: profile?.interests || [],
            xp: profile?.xp || 0,
            streak: profile?.streak || 1
          }
        })
      });

      const data = await resp.json();

      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        isRecommendation: isRec || data.isRecommendation
      };

      setMessages((prev) => [...prev, botMsg]);

      // If they clicked a personalized plan, reward XP for initiative!
      if (isRec) {
        onEarnXP(15);
      } else {
        onEarnXP(5);
      }
    } catch (err) {
      console.error("Study tutor endpoint error:", err);
      // Fallback
      const fallbackText = getFallbackResponse(text, isRec);
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        isRecommendation: isRec
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (query: string, isRec: boolean): string => {
    const qLower = query.toLowerCase();
    
    if (isRec || qLower.includes("recommend") || qLower.includes("plan") || qLower.includes("interests")) {
      return `### Personalized Study Recommendation for ${profile?.name || "Student"}
Based on your current experience profile of **${profile?.xp} XP** and your selected interests (**${profile?.interests?.join(", ")}**), I have generated this path:

1. **Trade Theory Core**: You should revise **Occupational Safety** primarily to build a robust safety baseline.
2. **Current Goal**: Reach **${profile?.xp + 100} XP** by solving the Star-Delta starter interactive quizzes.
3. **Mnemonic Helper**: Remember, in three-phase STAR configuration, line voltage $V_L = \\sqrt{3} \\cdot V_{Ph}$ whereas current is identical. In DELTA, voltage is identical and current $I_L = \\sqrt{3} \\cdot I_{Ph}$.

*Tip: Add a real Gemini API Key in Settings to get unbounded live curriculum mapping.*`;
    }

    if (qLower.includes("unpack") || qLower.includes("explain active") || qLower.includes("explain current")) {
      if (!activeChapter) {
        return "Select a unit in the syllabus directory list on the left first, then click this button to have me unpack its core formulas and diagrams!";
      }
      return `### Unpacking Current Unit: ${activeChapter.title}
Here is a deep dive explanation of the lesson **"${activeChapter.title}"** for your exam preparation:

*   **Core Practical Applications:** Underpinning ${activeChapter.description} is the industrial skill to trace wiring schemas and minimize power leakages.
*   **Formula Focus:** Ensure you memorize standard metric coefficients and protective ground resistance thresholds (< 1 Ohm in industrial earthing grids).
*   **Study Path:** Revise the companion MCQs listed below the chapter note text and score a performance grade to earn XP.`;
    }

    if (qLower.includes("practical") || qLower.includes("lab")) {
      return `### Industrial Practical Lab Guide
Here is the step-by-step practical checklist for electricians:

1.  **De-energization & Tag Out (LOTO):** Always isolate circuits at the main triple-pole switch. Apply Lock-Out Tag-Out pads.
2.  **Instrument Calibration:** Zero-calibrate your Megger or insulation multitester before making low-resistance feeder measures.
3.  **Earth Testing:** Verify earthing resistance regularly using standard three-point fall-of-potential test setups to maintain sub-1-Ohm safety margins.`;
    }

    return `### Local Tutor Simulation - Active Response
I parsed your query: **"${query}"** in relation to the **${selectedSubjectName}** syllabus.

To enable full conversational answers grounded in real NCVT curriculum textbooks, verify that a valid **GEMINI_API_KEY** is configured.

**Quick Reference Study Guide:**
*   **Topic:** ${selectedSubjectName}
*   **Status Connection:** Safe Offline Simulation Mode
*   **Key Formula:** Impedance $Z = \\sqrt{R^2 + (X_L - X_C)^2}$ for standard Alternating Current motors.`;
  };

  return (
    <div className="flex flex-col h-[520px] bg-slate-950/40 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-3xl relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Copilot Header */}
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-black">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              AI Study Copilot <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </h4>
            <span className="text-[9px] font-mono text-slate-400 uppercase">
              Current Focus: {selectedSubjectName || "General Apprentice"}
            </span>
          </div>
        </div>

        {activeChapter && (
          <div className="px-3 py-1 rounded-full bg-cyan-950/20 border border-cyan-500/20 text-[8px] font-mono text-cyan-300 uppercase max-w-[150px] truncate">
            📌 {activeChapter.title}
          </div>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-4 text-xs font-mono leading-relaxed relative ${
                m.sender === "user"
                  ? "bg-cyan-500 text-black rounded-tr-none font-bold"
                  : m.isRecommendation
                  ? "bg-purple-950/30 text-purple-200 border border-purple-500/30 rounded-tl-none shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                  : "bg-white/[0.03] text-slate-100 border border-white/5 rounded-tl-none"
              }`}
            >
              {/* Specialized icon header inside message if recommendation */}
              {m.isRecommendation && m.sender === "bot" && (
                <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-purple-500/20 text-[9px] text-purple-400 uppercase font-extrabold tracking-widest">
                  <Award className="w-3.5 h-3.5" /> Personalized recommendations list
                </div>
              )}

              {/* Main Text Content Parser */}
              <div className="space-y-2">
                {m.text.split("\n\n").map((para, idx) => {
                  if (para.startsWith("###")) {
                    return (
                      <h4 key={idx} className={`text-xs font-extrabold uppercase tracking-wide mt-3 mb-1.5 ${m.sender === 'user' ? 'text-black' : 'text-cyan-400'}`}>
                        {para.replace("###", "")}
                      </h4>
                    );
                  }
                  if (para.startsWith("1.") || para.startsWith("-")) {
                    return (
                      <div key={idx} className={`pl-3 border-l-2 my-2 space-y-1 ${m.sender === 'user' ? 'border-black/20 text-black' : 'border-cyan-500/20 text-slate-300'}`}>
                        {para.split("\n").map((line, lIdx) => (
                          <div key={lIdx} className="flex items-start gap-1">
                            <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60" />
                            <span>{line.replace(/^[-1-9\.\s]+/, "")}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return <p key={idx} className={m.sender === 'user' ? 'text-black' : 'text-slate-300'}>{para}</p>;
                })}
              </div>

              <div className={`text-[8px] opacity-40 text-right mt-2 ${m.sender === 'user' ? 'text-black' : 'text-slate-500'}`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 text-xs text-slate-400 flex items-center gap-2 font-mono">
              <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider">Syncing syllabus matrix...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Buttons */}
      <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto">
        <button
          onClick={() => handleSendMessage("Generate a personalized electrician study plan based on my profile interests and XP score.", true)}
          disabled={isLoading}
          className="shrink-0 flex items-center gap-1.5 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-purple-300 rounded-xl px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider cursor-pointer font-semibold transition-all disabled:opacity-50"
        >
          <Award className="w-3 h-3 text-purple-400" /> ✨ Personalized study plan
        </button>

        {activeChapter ? (
          <button
            onClick={() => handleSendMessage(`Unpack and explain the formulas and practical highlights from the active syllabus unit: "${activeChapter.title}".`)}
            disabled={isLoading}
            className="shrink-0 flex items-center gap-1.5 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 rounded-xl px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider cursor-pointer font-semibold transition-all disabled:opacity-50"
          >
            <BookOpen className="w-3 h-3 text-cyan-400" /> 📖 Unpack current unit
          </button>
        ) : (
          <button
            onClick={() => handleSendMessage("What concepts should I study for my upcoming high voltage electrician lab practicals?")}
            disabled={isLoading}
            className="shrink-0 flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-400 rounded-xl px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50"
          >
            🔌 Practical lab safety checklist
          </button>
        )}

        <button
          onClick={() => handleSendMessage("Ask me a random electrician exam mock MCQ to test my conceptual memory.", false)}
          disabled={isLoading}
          className="shrink-0 flex items-center gap-1.5 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/30 text-blue-300 rounded-xl px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider cursor-pointer font-semibold transition-all disabled:opacity-50"
        >
          <HelpCircle className="w-3 h-3 text-blue-400" /> ❓ Exam Memory Drill
        </button>
      </div>

      {/* Input controls */}
      <div className="p-3 bg-black/60 border-t border-white/5 flex gap-2">
        <input
          type="text"
          placeholder="Ask Study AI to explain formulas or suggest lessons..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
          disabled={isLoading}
          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-600 disabled:opacity-50"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputText.trim()}
          className="px-4.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
