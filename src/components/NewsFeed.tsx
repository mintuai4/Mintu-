import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NewsArticle } from "../types";
import { Sparkles, Terminal, Calendar, ArrowRight } from "lucide-react";

export default function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeSummaryIndex, setActiveSummaryIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const resp = await fetch("/api/news");
        const data = await resp.json();
        setArticles(data.news);
      } catch (err) {
        console.error("Failed to load news articles from backend:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const categories = [
    { id: "all", label: "All News" },
    { id: "ai", label: "Artificial Intelligence" },
    { id: "technology", label: "Technology" },
    { id: "education", label: "Education" },
    { id: "cricket", label: "Cricket" }
  ];

  const filteredArticles = selectedCategory === "all"
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="font-sans text-white">
      
      {/* Categories Horizontal scroller */}
      <div className="flex gap-2 overflow-x-auto pb-5 mb-3 select-none no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setActiveSummaryIndex(null); }}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-mono border tracking-wide transition-all uppercase cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-white text-black border-white shadow-xl"
                : "bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-spin mr-2" />
            <span className="font-mono text-sm tracking-widest text-slate-400 uppercase">Indexing News Feed...</span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-12 text-center font-mono text-sm text-slate-400 uppercase">
            No bulletins found in this coordinate.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((art, idx) => (
              <motion.div
                key={art.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative flex flex-col justify-between p-6 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/5 hover:border-cyan-500/20 transition-all group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-slate-300">
                      {art.category}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-500" /> {art.time}
                    </span>
                  </div>

                  {art.imageUrl && (
                    <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 relative">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                  )}

                  <h3 className="text-sm font-bold font-mono tracking-tight text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-[11px] leading-relaxed text-slate-400 mt-2.5 font-mono line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">{art.source}</span>
                  <button
                    onClick={() => setActiveSummaryIndex(activeSummaryIndex === idx ? null : idx)}
                    className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    {activeSummaryIndex === idx ? "Collapse Info" : "Expand Summary"}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Simulated AI Instant Summarization Dropdown */}
                {activeSummaryIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4.5 rounded-2xl bg-cyan-950/10 border border-cyan-500/15 font-mono text-xs text-cyan-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-300">Mintor Intelligence Briefing</span>
                    </div>
                    <p className="leading-relaxed">
                      AI Summary: This update underlines a critical intersection of {art.category === "ai" ? "machine learning neural overlays" : art.category === "cricket" ? "sports tracking statistics" : "industrial curriculum changes"} with standard vocational safety practices. Recommended for study guides.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
