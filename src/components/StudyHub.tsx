import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ELECTRICIAN_SUBJECTS } from "../data/electrician";
import { 
  BookOpen, Award, FileText, CheckCircle2, AlertTriangle, 
  Play, HelpCircle, Brain, Sparkles 
} from "lucide-react";
import StudyHubAI from "./StudyHubAI";

interface StudyHubProps {
  profile: any;
  onEarnXP: (xp: number) => void;
}

export default function StudyHub({ profile, onEarnXP }: StudyHubProps) {
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<string>("theory");
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number | null>(null);
  const [activePanelTab, setActivePanelTab] = useState<"notes" | "ai">("notes");
  
  // MCQ Practice State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [scoreEarned, setScoreEarned] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState("");

  const subjectKeys = Object.keys(ELECTRICIAN_SUBJECTS);
  const activeSubject = ELECTRICIAN_SUBJECTS[selectedSubjectKey];

  // Filter chapters based on 1st/2nd Year selector
  const chaptersFiltered = activeSubject.chapters.filter(
    (ch) => ch.year === selectedYear
  );

  const handleSelectAnswer = (mcqIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [mcqIdx]: optIdx
    }));
  };

  const calculateMCQScore = (mcqs: any[]) => {
    let score = 0;
    mcqs.forEach((mcq, idx) => {
      if (selectedAnswers[idx] === mcq.answerIndex) {
        score += 10;
      }
    });

    onEarnXP(score);
    setScoreEarned(true);
  };

  const simulateNotesDownload = (title: string) => {
    setDownloadSuccessMsg(`Downloaded "${title} - Syllabus.pdf" to Local Storage`);
    setTimeout(() => {
      setDownloadSuccessMsg("");
    }, 4000);
  };

  return (
    <div className="font-sans text-white">
      
      {/* Subject Selector Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl mb-6">
        {subjectKeys.map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedSubjectKey(key);
              setActiveChapterIdx(null);
              setSelectedAnswers({});
              setScoreEarned(false);
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              selectedSubjectKey === key
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {ELECTRICIAN_SUBJECTS[key].name}
          </button>
        ))}
      </div>

      {/* Year Selector Tabs */}
      <div className="flex gap-4 items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 font-mono">
            {activeSubject.name} Syllabus
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5 uppercase tracking-wider">
            Curriculum coordinates mapping active
          </p>
        </div>

        <div className="flex gap-2 p-0.5 bg-white/[0.04] rounded-lg border border-white/5">
          <button
            onClick={() => { setSelectedYear(1); setActiveChapterIdx(null); }}
            className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all ${
              selectedYear === 1 ? "bg-white/[0.08] text-cyan-400" : "text-slate-400"
            }`}
          >
            1st Year
          </button>
          <button
            onClick={() => { setSelectedYear(2); setActiveChapterIdx(null); }}
            className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all ${
              selectedYear === 2 ? "bg-white/[0.08] text-purple-400" : "text-slate-400"
            }`}
          >
            2nd Year
          </button>
        </div>
      </div>

      {/* Chapters list layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Chapter Select Card */}
        <div className="lg:col-span-1 space-y-3">
          {chaptersFiltered.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveChapterIdx(idx);
                setSelectedAnswers({});
                setScoreEarned(false);
                // Reset tab to notes to encourage studying
                setActivePanelTab("notes");
              }}
              className={`w-full p-4.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col items-start cursor-pointer ${
                activeChapterIdx === idx
                  ? "bg-slate-900 border-cyan-500/40 shadow-md"
                  : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl" />
              <span className="text-[9px] font-mono text-cyan-400/80 mb-1 uppercase tracking-wider">UNIT 0{idx + 1}</span>
              <h4 className="text-xs font-bold font-mono text-slate-200">{ch.title}</h4>
              <p className="text-[10px] text-slate-400 mt-1.5 font-mono line-clamp-2">{ch.description}</p>
            </button>
          ))}
        </div>

        {/* Right Side: Copilot and Notes Dynamic Tab Panel */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          
          {/* Top Panel Tab Selector */}
          <div className="flex gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-2xl max-w-sm">
            <button
              onClick={() => setActivePanelTab("notes")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activePanelTab === "notes"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Syllabus Notes
            </button>
            <button
              onClick={() => setActivePanelTab("ai")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                activePanelTab === "ai"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              AI Study Copilot
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activePanelTab === "notes" ? (
              <motion.div
                key="notes-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {activeChapterIdx !== null ? (
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-xl space-y-6">
                    {/* Header actions */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Active Study Plan</span>
                        <h3 className="text-sm font-bold font-mono text-cyan-400 mt-0.5">{chaptersFiltered[activeChapterIdx].title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => simulateNotesDownload(chaptersFiltered[activeChapterIdx].title)}
                          className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-mono text-[10px] tracking-wider uppercase cursor-pointer"
                        >
                          Export PDF
                        </button>
                      </div>
                    </div>

                    {downloadSuccessMsg && (
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/25 text-emerald-300 rounded-xl font-mono text-xs">
                        ✔ {downloadSuccessMsg}
                      </div>
                    )}

                    {/* Study Notes Markdown Area */}
                    <div className="bg-black/40 rounded-2xl p-4 md:p-5 border border-white/5 max-h-80 overflow-y-auto font-mono text-xs space-y-4 text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                      <div className="flex items-center gap-2 text-cyan-400 mb-2 border-b border-cyan-500/10 pb-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-[10px] tracking-widest uppercase font-extrabold">Trade Reference Guide</span>
                      </div>
                      
                      {chaptersFiltered[activeChapterIdx].notes.split("\n\n").map((para, pIdx) => {
                        if (para.startsWith("###")) {
                          return <h4 key={pIdx} className="text-sm font-bold text-cyan-300 tracking-tight mt-4 mb-2">{para.replace("###", "")}</h4>;
                        }
                        if (para.startsWith("-") || para.startsWith("1.")) {
                          return (
                            <div key={pIdx} className="pl-3 border-l-2 border-cyan-500/20 space-y-1.5 my-2">
                              {para.split("\n").map((line, lIdx) => (
                                <p key={lIdx}>{line}</p>
                              ))}
                            </div>
                          );
                        }
                        return <p key={pIdx}>{para}</p>;
                      })}
                    </div>

                    {/* Study MCQs Drill */}
                    {chaptersFiltered[activeChapterIdx].mcqs.length > 0 && (
                      <div className="space-y-4 mt-6">
                        <h4 className="text-xs font-bold font-mono text-purple-400 tracking-widest uppercase flex items-center gap-2">
                          <HelpCircle className="w-4 h-4" /> Practical MCQ Drill
                        </h4>

                        {chaptersFiltered[activeChapterIdx].mcqs.map((mcq, mIdx) => (
                          <div key={mIdx} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
                            <p className="text-xs font-mono text-slate-200">
                              Q{mIdx + 1}: {mcq.question}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {mcq.options.map((opt, oIdx) => {
                                const selected = selectedAnswers[mIdx] === oIdx;
                                const isCorrect = oIdx === mcq.answerIndex;
                                let btnStyle = "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] text-slate-300";
                                
                                if (selected) {
                                  if (scoreEarned) {
                                    btnStyle = isCorrect 
                                      ? "bg-emerald-950/20 border-emerald-500 text-emerald-300 font-bold"
                                      : "bg-rose-950/20 border-rose-500 text-rose-300";
                                  } else {
                                    btnStyle = "bg-cyan-950/20 border-cyan-400 text-cyan-300 font-bold";
                                  }
                                } else if (scoreEarned && isCorrect) {
                                  btnStyle = "bg-emerald-950/10 border-emerald-500/20 text-emerald-400";
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    disabled={scoreEarned}
                                    onClick={() => handleSelectAnswer(mIdx, oIdx)}
                                    className={`p-2.5 rounded-xl border text-left font-mono text-[10px] transition-all cursor-pointer ${btnStyle}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {scoreEarned && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-slate-900 border border-white/5 p-3 rounded-xl flex gap-2"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="block text-[9px] font-mono text-emerald-400 uppercase font-extrabold">Explanation</span>
                                  <span className="text-[10px] font-mono text-slate-300 leading-normal">{mcq.explanation}</span>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        ))}

                        <div className="flex justify-end pt-2">
                          {!scoreEarned ? (
                            <button
                              onClick={() => calculateMCQScore(chaptersFiltered[activeChapterIdx].mcqs)}
                              className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-mono text-xs font-bold uppercase rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] select-none transition-all cursor-pointer"
                            >
                              Submit Practice Answers
                            </button>
                          ) : (
                            <button
                              onClick={() => { setSelectedAnswers({}); setScoreEarned(false); }}
                              className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-slate-300 font-mono text-xs rounded-xl transition-all cursor-pointer"
                            >
                              Reset Drill Options
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-8 bg-white/[0.01] border border-white/5 rounded-3xl border-dashed">
                    <BookOpen className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
                    <h4 className="text-sm font-bold font-mono text-slate-300 uppercase">Load chapter notes</h4>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">Select an active Syllabus Unit on the left</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="ai-copilot-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <StudyHubAI
                  profile={profile}
                  activeChapter={activeChapterIdx !== null ? chaptersFiltered[activeChapterIdx] : null}
                  selectedSubjectName={activeSubject.name}
                  onEarnXP={onEarnXP}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
