import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Mic, Sparkles, BookOpen, Flame, Newspaper, GraduationCap, Video, CheckCircle2, ChevronRight, Volume2 } from "lucide-react";

interface SearchEngineProps {
  onEarnXP: (xp: number) => void;
}

interface SourcesChunk {
  title: string;
  uri: string;
}

const SEARCH_CATEGORIES = [
  { id: "all", label: "Smart Search", icon: Sparkles, color: "text-cyan-400" },
  { id: "study", label: "Study Materials", icon: BookOpen, color: "text-blue-400" },
  { id: "videos", label: "YouTube Videos", icon: Video, color: "text-rose-400" },
  { id: "quiz", label: "Quizzes & MCQ", icon: GraduationCap, color: "text-emerald-400" },
  { id: "cricket", label: "Cricket Scores", icon: Flame, color: "text-amber-400" },
  { id: "news", label: "News Updates", icon: Newspaper, color: "text-purple-400" }
];

const PRE_SEARCH_SUGGESTIONS = [
  "Explain Faraday's Law of self induction in detail",
  "Latest live score ticker for Mumbai Indians IPL",
  "Formulate a summary of Class D electrical hazards",
  "What is the efficiency coefficient of standard step-down transformer?",
  "Latest updates in Apple Vision Pro spatial UI design"
];

export default function SearchEngine({ onEarnXP }: SearchEngineProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [isMicActive, setIsMicActive] = useState(false);
  const [speechText, setSpeechText] = useState("");

  const handleSearchSubmit = async (searchOver?: string) => {
    const term = searchOver || query;
    if (!term.trim()) return;

    if (searchOver) setQuery(term);
    
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: term, category })
      });
      const data = await response.json();
      setResult(data);

      onEarnXP(5); // Search rewards XP
    } catch (err) {
      console.error("Search pipeline error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate premium speech voice recognition dictation
  const handleToggleVoiceSearch = () => {
    if (isMicActive) {
      setIsMicActive(false);
      return;
    }
    setIsMicActive(true);
    setSpeechText("Listening ambient coordinates...");

    const phrase = "Difference between AC and DC transformer transmission";
    setTimeout(() => {
      setSpeechText("Vocal matrix analysis parsed: AC vs DC...");
    }, 1500);

    setTimeout(() => {
      setIsMicActive(false);
      setQuery(phrase);
      handleSearchSubmit(phrase);
    }, 3200);
  };

  return (
    <div className="font-sans text-white">
      
      {/* Center Search Container */}
      <div className="max-w-3xl mx-auto flex flex-col items-center py-6 text-center">
        
        {/* Cinematic Welcome Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2 justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-semibold">VisionOS Search Engine</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono text-slate-100 uppercase">
            MINTOR AI SEARCH
          </h2>
          <p className="text-xs text-slate-500 font-mono tracking-wider mt-1.5 uppercase">
            Search YouTube videos, study notes, quizzes, cricket scores, news, and syllabus...
          </p>
        </motion.div>

        {/* Large Liquid Glass Search Bar Group */}
        <div className="w-full relative group mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/10 rounded-2xl blur-lg opacity-30 group-focus-within:opacity-80 transition-opacity" />
          
          <div className="relative flex items-center bg-slate-950/65 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 px-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] focus-within:border-cyan-500/40 transition-all">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            
            <input
              type="text"
              placeholder="Query electrician notes, IPL scores, news summary, or AI assistant doubts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="w-full bg-transparent px-3 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-0"
            />

            {/* Simulated Microphone / Dictating action */}
            <button
              onClick={handleToggleVoiceSearch}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isMicActive 
                  ? "bg-rose-500/10 border-rose-500 text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-bounce"
                  : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handleSearchSubmit()}
              className="ml-2.5 p-2 px-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-mono font-bold tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 cursor-pointer shrink-0 transition-all"
            >
              SEARCH
            </button>
          </div>
        </div>

        {/* Categories Bar Checkboxes */}
        <div className="flex flex-wrap gap-2 justify-center mb-10 pb-2 max-w-2xl select-none">
          {SEARCH_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-mono tracking-wide uppercase transition-all relative overflow-hidden cursor-pointer ${
                  active
                    ? "bg-white text-black border-white shadow-xl"
                    : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/10"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-slate-900" : cat.color}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Mic Active Backdrop Onboarding state */}
        <AnimatePresence>
          {isMicActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full p-4 mb-8 bg-rose-950/10 border border-rose-500/20 text-rose-300 rounded-2xl font-mono text-xs text-center relative overflow-hidden"
            >
              <div className="flex justify-center items-center gap-2">
                <Volume2 className="w-4 h-4 text-rose-400 animate-spin" />
                <span>{speechText}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* SEARCH RESULTS BOARD */}
      <AnimatePresence mode="wait">
        
        {/* LOADING SCENE */}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto py-12 flex flex-col justify-center items-center text-center font-mono text-xs text-slate-400 space-y-4"
          >
            <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
            <p className="uppercase tracking-widest">Compiling holographic answer blocks...</p>
          </motion.div>
        )}

        {/* RESULTS CARDS */}
        {result && !isLoading && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            
            {/* Primary AI Answer Markdown block */}
            <div className="p-6 md:p-8 rounded-3xl bg-slate-950/65 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-3xl" />
              
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4 justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">Intelligent AI summary (grounded)</span>
                </div>
                <span className="text-[8px] font-mono text-slate-500 uppercase">Search Category: {result.category}</span>
              </div>

              {/* AI Markdown summary content */}
              <div className="font-mono text-xs leading-relaxed text-slate-300 space-y-4">
                {result.answer.split("\n\n").map((para: string, pIdx: number) => {
                  if (para.startsWith("###")) {
                    return (
                      <h4 key={pIdx} className="text-sm font-bold text-cyan-400 tracking-tight mt-6 mb-2">
                        {para.replace("###", "")}
                      </h4>
                    );
                  }
                  if (para.startsWith("1.") || para.startsWith("-")) {
                    return (
                      <div key={pIdx} className="pl-4 border-l-2 border-cyan-500/10 space-y-1.5 my-3">
                        {para.split("\n").map((line, lIdx) => (
                          <p key={lIdx}>{line}</p>
                        ))}
                      </div>
                    );
                  }
                  return <p key={pIdx}>{para}</p>;
                })}
              </div>

              {/* Citations Grounding bibliography */}
              {result.sources && result.sources.length > 0 && (
                <div className="mt-8 pt-5 border-t border-white/5">
                  <span className="block text-[8px] uppercase tracking-widest font-mono text-slate-500 mb-3">Grounding Bibliography Sources:</span>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((s: SourcesChunk, idx: number) => (
                      <a
                        key={idx}
                        href={s.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 p-2 px-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] uppercase font-mono text-slate-400 hover:text-cyan-400 hover:bg-white/[0.04] transition-all"
                      >
                        <ChevronRight className="w-3 h-3 text-cyan-500" />
                        <span className="max-w-[140px] truncate">{s.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sub Resources Grid (Youtube Videos list & Quiz queries inline) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              
              {/* Extra Dynamic Youtube section if selected category */}
              {result.youtubeVideos && result.youtubeVideos.length > 0 && (
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-lg">
                  <h4 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Video className="w-4 h-4" /> YouTube Video Lessons found
                  </h4>

                  <div className="space-y-4">
                    {result.youtubeVideos.map((v: any, idx: number) => (
                      <div key={idx} className="space-y-2">
                        <div className="w-full h-36 rounded-xl overflow-hidden relative border border-white/5">
                          {/* Fallback to simulated embedded player */}
                          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center p-4">
                            <span className="text-[9px] uppercase font-mono text-slate-500">Video player placeholder</span>
                            <span className="text-xs font-semibold font-mono text-slate-300 mt-2 line-clamp-1">{v.title}</span>
                            <a
                              href={`https://www.youtube.com/watch?v=${v.videoId}`}
                              target="_blank" rel="noreferrer"
                              className="mt-3.5 px-3 py-1 bg-rose-600 text-white font-mono text-[9px] rounded uppercase font-bold tracking-wider hover:bg-rose-500 transition-colors cursor-pointer"
                            >
                              Launch YouTube
                            </a>
                          </div>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
                          <span>{v.channel}</span>
                          <span>Duration: 14:02</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra Dynamic Quizzes generated inline */}
              {result.quizQuestions && result.quizQuestions.length > 0 && (
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-lg">
                  <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Quick Practice MCQ
                  </h4>

                  {result.quizQuestions.map((q: any, idx: number) => (
                    <div key={idx} className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5">
                      <p className="text-xs font-mono text-slate-300">Q: {q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt: string, oIdx: number) => (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border text-[10px] font-mono ${
                              oIdx === q.answerIndex 
                                ? "bg-emerald-950/25 border-emerald-500/40 text-emerald-400"
                                : "bg-white/[0.01] border-white/5 text-slate-400"
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[8px] font-mono uppercase text-emerald-400 font-bold">Explanation</span>
                          <span className="text-[9px] font-mono text-slate-300 leading-normal">{q.explanation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </motion.div>
        )}

        {/* DEFAULT STATE SUGGESTIONS */}
        {!result && !isLoading && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            className="max-w-2xl mx-auto mt-6"
          >
            <span className="block text-[8px] uppercase tracking-widest font-mono text-slate-500 text-center mb-4">Trending intelligence searches:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {PRE_SEARCH_SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearchSubmit(s)}
                  className="flex items-center gap-2 p-3 bg-white/[0.01] border border-white/5 hover:border-cyan-500/25 rounded-2xl text-left font-mono text-[10px] text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 shrink-0 text-cyan-500/40" />
                  <span className="truncate">{s}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
