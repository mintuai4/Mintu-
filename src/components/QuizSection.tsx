import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Zap, Shield, Trophy, Flame, Play, Clock, User, CheckCircle2, AlertCircle } from "lucide-react";
import { QuizQuestion } from "../types";

interface QuizSectionProps {
  streak: number;
  xp: number;
  badges: string[];
  onEarnXP: (xp: number) => void;
  onUnlockBadge: (badge: string) => void;
}

const BATTLE_QUESTIONS: QuizQuestion[] = [
  {
    question: "What is the primary formula used to quantify dynamic core magnetic power loss due to eddy currents?",
    options: ["Pe = Ke · f² · t² · Bmax²", "Ph = Kh · f · Bmax^(1.6)", "V = I · R", "P = V · I · cosθ"],
    answerIndex: 0,
    explanation: "Eddy current power loss ($Pe$) is proportional to the square of frequency ($f²$), lamination thickness ($t²$), and flux density ($Bmax²$)."
  },
  {
    question: "Which tool or technique is utilized to verify insulation resistance values of active electrical feeders?",
    options: ["Wheatstone Bridge", "Megger Insulation Tester", "Multimeter Ohms Range", "Clamp-On Ammeter"],
    answerIndex: 1,
    explanation: "A Megger outputs heavy DC test voltages (e.g., 500V/1000V) to assess insulating resistance in millions of ohms."
  },
  {
    question: "How is an active Star-Delta starter used to curb starting induction motor currents?",
    options: ["Steps up voltage initially", "Reduces starting physical voltage by √3 times", "Increases poles counts", "Adds rotor resistance"],
    answerIndex: 1,
    explanation: "By deploying Star configuration at startup, current falls because starting phase tension drops to $1/\\sqrt{3}$ of line voltage."
  }
];

export default function QuizSection({ streak, xp, badges, onEarnXP, onUnlockBadge }: QuizSectionProps) {
  const [gameState, setGameState] = useState<"lobby" | "searching" | "battle" | "finished">("lobby");
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  
  // Simulated Opponent details
  const [opponentName] = useState("Rajat_Kumar_ITI");
  const [botAnsweringState, setBotAnsweringState] = useState("");

  const leaderboard = [
    { rank: 1, name: "Pranab Shridhar", xp: 1420, active: true },
    { rank: 2, name: "Suresh Patil", xp: 1100, active: false },
    { rank: "You", name: "Guest User", xp: xp, active: true },
    { rank: 4, name: "Rajat_Kumar_ITI", xp: 850, active: false },
    { rank: 5, name: "Anita Mandal", xp: 720, active: false }
  ];

  // Initiate Matchmaking
  const handleStartSearch = () => {
    setGameState("searching");
    setTimeout(() => {
      setGameState("battle");
      setCurrentQIdx(0);
      setUserScore(0);
      setBotScore(0);
      setHasAnswered(false);
      setSelectedOpt(null);
      setTimeLeft(15);
    }, 3000);
  };

  // Timer simulation
  useEffect(() => {
    if (gameState !== "battle") return;

    if (timeLeft <= 0) {
      handleNextQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  // Simulate Opponent's Decision Tick
  useEffect(() => {
    if (gameState !== "battle" || hasAnswered) return;

    const opTimer = setTimeout(() => {
      const matchQ = BATTLE_QUESTIONS[currentQIdx];
      // 70% chance bot lands correct answer
      const correct = Math.random() < 0.75;
      if (correct) {
        setBotScore((prev) => prev + 10);
        setBotAnsweringState(`${opponentName} selected correct answer!`);
      } else {
        setBotAnsweringState(`${opponentName} made an error.`);
      }
    }, 5000 + Math.random() * 3000);

    return () => clearTimeout(opTimer);
  }, [currentQIdx, gameState, hasAnswered]);

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOpt(idx);
    setHasAnswered(true);

    const isCorrect = idx === BATTLE_QUESTIONS[currentQIdx].answerIndex;
    if (isCorrect) {
      setUserScore((prev) => prev + 10);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIdx < BATTLE_QUESTIONS.length - 1) {
      setCurrentQIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setHasAnswered(false);
      setTimeLeft(15);
      setBotAnsweringState("");
    } else {
      setGameState("finished");
      const bonusXP = userScore;
      onEarnXP(bonusXP);
      
      // Unlock badge based on success
      if (userScore >= 30) {
        onUnlockBadge("Ohm's Overlord");
      } else {
        onUnlockBadge("Transformer Apprentice");
      }
    }
  };

  return (
    <div className="font-sans text-white">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Streaks, Leaderboard, Badges */}
        <div className="space-y-6">
          
          {/* Streak & XP Badge Panel */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/5 rounded-full blur-xl" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-black">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Interactive Streak</span>
                <span className="text-sm font-bold font-mono tracking-tight text-slate-100">{streak} Days Active</span>
              </div>
            </div>

            <div className="text-right">
              <span className="block text-[8px] font-mono text-slate-400 uppercase">Cumulative XP</span>
              <span className="text-lg font-extrabold text-cyan-400 font-mono tracking-tighter">{xp} XP</span>
            </div>
          </div>

          {/* Leaderboard Table widget */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden">
            <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest gap-2 flex items-center mb-5">
              <Trophy className="w-4 h-4" /> Global Leaderboard
            </h4>

            <div className="space-y-2.5">
              {leaderboard.map((u, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono ${
                    u.name === "Guest User"
                      ? "bg-cyan-950/20 border-cyan-500/25"
                      : "bg-white/[0.01] border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500 font-bold">#{u.rank}</span>
                    <span className="text-slate-200">{u.name}</span>
                  </div>
                  <span className="text-cyan-400 font-bold">{u.rank === "You" ? xp : u.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Inventory panel */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden">
            <h4 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-widest gap-2 flex items-center mb-4">
              <Award className="w-4 h-4" /> Unlocked Badges
            </h4>

            <div className="flex flex-wrap gap-2.5">
              {badges.length > 0 ? (
                badges.map((b, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-300 font-mono text-[9px] uppercase tracking-wider font-semibold"
                  >
                    🏆 {b}
                  </span>
                ))
              ) : (
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Play quiz fight to capture trophies</span>
              )}
            </div>
          </div>

        </div>

        {/* Right column: Interactive Quiz Battle Arena */}
        <div className="lg:col-span-2">
          
          <AnimatePresence mode="wait">
            
            {/* Case Lobby: Click to play */}
            {gameState === "lobby" && (
              <motion.div
                key="lobby"
                className="h-full min-h-[400px] rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex flex-col justify-center items-center text-center p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl font-mono" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center mb-6 text-black shadow-lg">
                  <Play className="w-8 h-8 font-extrabold fill-current" />
                </div>
                
                <h3 className="text-lg font-bold font-mono text-slate-200">Interactive Quiz Battle</h3>
                <p className="text-xs font-mono text-slate-400 mt-2 max-w-sm leading-relaxed uppercase tracking-wider">
                  Syllabus matchmaking. Pit yourself against random ITI student avatars in real-time.
                </p>

                <button
                  onClick={handleStartSearch}
                  className="mt-8 px-6 py-3.5 bg-cyan-500 text-black font-extrabold font-mono text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
                >
                  START MATCHMAKING
                </button>
              </motion.div>
            )}

            {/* Case Matchmaking Search */}
            {gameState === "searching" && (
              <motion.div
                key="searching"
                className="h-full min-h-[400px] rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex flex-col justify-center items-center text-center p-8 overflow-hidden"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-cyan-400">ITI</div>
                </div>

                <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-slate-300">Searching coordinates...</h3>
                <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider mt-2.5">Allocating secure electrician simulator...</p>

                <div className="mt-8 p-3 bg-black/60 rounded-xl border border-white/5 text-[9px] font-mono text-slate-400 tracking-wider uppercase">
                  Connected: Mumbai Node II • PING: 18ms
                </div>
              </motion.div>
            )}

            {/* Case Battle Active */}
            {gameState === "battle" && (
              <motion.div
                key="battle"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-white/[0.02] border border-cyan-500/20 backdrop-blur-3xl space-y-6"
              >
                {/* Battle Header */}
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold font-mono text-slate-200">You ({userScore} pts)</span>
                  </div>

                  <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-rose-300">{timeLeft}s</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold font-mono text-slate-200">{opponentName} ({botScore} pts)</span>
                  </div>
                </div>

                {/* Question panel */}
                <div>
                  <span className="text-[9px] uppercase font-mono bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-slate-400">
                    Question {currentQIdx + 1} of {BATTLE_QUESTIONS.length}
                  </span>
                  <h3 className="text-sm font-mono tracking-wide text-slate-100 mt-4 leading-relaxed">
                    {BATTLE_QUESTIONS[currentQIdx].question}
                  </h3>
                </div>

                {/* Options grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {BATTLE_QUESTIONS[currentQIdx].options.map((opt, idx) => {
                    const isSelected = selectedOpt === idx;
                    const isCorrect = idx === BATTLE_QUESTIONS[currentQIdx].answerIndex;
                    let optStyle = "bg-white/[0.02] border-white/5 hover:border-white/10 text-slate-300";

                    if (hasAnswered) {
                      if (isSelected) {
                        optStyle = isCorrect
                          ? "bg-emerald-950/20 border-emerald-500 text-emerald-300"
                          : "bg-rose-950/20 border-rose-500 text-rose-300";
                      } else if (isCorrect) {
                        optStyle = "bg-emerald-950/10 border-emerald-500/20 text-emerald-400";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(idx)}
                        className={`p-4.5 rounded-2xl border text-left font-mono text-xs transition-all cursor-pointer ${optStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Live Match Opponent Action Logs */}
                {botAnsweringState && (
                  <div className="p-3.5 rounded-xl bg-purple-950/10 border border-purple-500/15 text-[10px] font-mono text-purple-300 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>{botAnsweringState}</span>
                  </div>
                )}

                {/* Bottom progression click */}
                {hasAnswered && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 bg-cyan-500 text-black font-bold font-mono text-xs uppercase rounded-xl hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] select-none cursor-pointer"
                    >
                      {currentQIdx < BATTLE_QUESTIONS.length - 1 ? "Next Turn" : "Complete Battle"}
                    </button>
                  </div>
                )}

              </motion.div>
            )}

            {/* Case Game Finished outcome */}
            {gameState === "finished" && (
              <motion.div
                key="finished"
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold font-mono text-slate-200">Battle Finished</h3>
                  <p className="text-[10px] uppercase font-mono text-slate-500 tracking-widest">Calculated outcome logs</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 text-center">
                    <span className="block text-[8px] uppercase font-mono text-slate-400 mb-1">Your score</span>
                    <span className="text-xl font-bold font-mono text-cyan-400">{userScore} Pts</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 text-center">
                    <span className="block text-[8px] uppercase font-mono text-slate-400 mb-1">Opponent Score</span>
                    <span className="text-xl font-bold font-mono text-purple-400">{botScore} Pts</span>
                  </div>
                </div>

                <div className="p-4.5 bg-cyan-950/10 border border-cyan-500/15 max-w-sm mx-auto rounded-2xl text-[10px] font-mono text-cyan-300 leading-normal">
                  🏆 Success! You outperformed the benchmark ITI profile. You earned **+{userScore} XP** inside the active streak.
                </div>

                <div className="flex justify-center gap-2 md:grid grid-cols-2 max-w-xs mx-auto">
                  <button
                    onClick={() => setGameState("lobby")}
                    className="flex-1 py-3 border border-white/10 hover:bg-white/5 rounded-xl font-mono text-xs uppercase cursor-pointer"
                  >
                    Go Back Lobby
                  </button>
                  <button
                    onClick={handleStartSearch}
                    className="flex-1 py-3 bg-cyan-500 text-black font-bold rounded-xl font-mono text-xs uppercase cursor-pointer"
                  >
                    Requeue Match
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
