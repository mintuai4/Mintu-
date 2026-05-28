import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "./types";

// Component imports
import CinematicLoader from "./components/CinematicLoader";
import OTPAuth from "./components/OTPAuth";
import SearchEngine from "./components/SearchEngine";
import StudyHub from "./components/StudyHub";
import CricketScores from "./components/CricketScores";
import NewsFeed from "./components/NewsFeed";
import QuizSection from "./components/QuizSection";
import AIChatBot from "./components/AIChatBot";

// Icons
import { 
  Sparkles, BookOpen, Flame, Newspaper, GraduationCap, 
  User, Compass, Shield, LogOut, Heart 
} from "lucide-react";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"search" | "study" | "cricket" | "news" | "quiz">("search");
  const [currentUtcTime, setCurrentUtcTime] = useState("");

  // System notification banner
  const [sysNotice, setSysNotice] = useState<string | null>(null);

  // Read state from localStorage
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("mintor_auth_status");
      const storedProfile = localStorage.getItem("mintor_user_profile");
      if (storedAuth === "true" && storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (err) {
      console.error("Local storage restoration interrupted:", err);
    }
  }, []);

  // Update real-time clock indicator (UTC)
  useEffect(() => {
    const updateTime = () => {
      const parts = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setCurrentUtcTime(`${parts} UTC`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleOnboardingSuccess = (setup: { name: string; emailOrPhone: string; interests: string[] }) => {
    const freshProfile: UserProfile = {
      name: setup.name,
      interests: setup.interests,
      xp: 120, // baseline onboarding reward
      streak: 1, // first day streak
      authenticated: true,
      phoneOrEmail: setup.emailOrPhone,
      badges: []
    };

    setProfile(freshProfile);
    localStorage.setItem("mintor_auth_status", "true");
    localStorage.setItem("mintor_user_profile", JSON.stringify(freshProfile));

    triggerAlertNotice(`Welcome configured! +120 XP earned in local grid.`);
  };

  const handleEarnXP = (value: number) => {
    if (!profile) return;
    setProfile((prev) => {
      if (!prev) return null;
      const updated = { ...prev, xp: prev.xp + value };
      localStorage.setItem("mintor_user_profile", JSON.stringify(updated));
      return updated;
    });

    triggerAlertNotice(`✔ Success: Earned +${value} XP! Check Leaderboard.`);
  };

  const handleUnlockBadge = (badge: string) => {
    if (!profile) return;
    setProfile((prev) => {
      if (!prev) return null;
      if (prev.badges.includes(badge)) return prev;

      const updated = { ...prev, badges: [...prev.badges, badge] };
      localStorage.setItem("mintor_user_profile", JSON.stringify(updated));
      return updated;
    });

    triggerAlertNotice(`🏆 Trophy Awarded: "${badge}" badge unlocked!`);
  };

  const handleLogOut = () => {
    localStorage.removeItem("mintor_auth_status");
    localStorage.removeItem("mintor_user_profile");
    setProfile(null);
    triggerAlertNotice("Identity cleared from sandboxed local session.");
  };

  const triggerAlertNotice = (msg: string) => {
    setSysNotice(msg);
    setTimeout(() => {
      setSysNotice(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      
      {/* 1. Cinematic Loading overlay screen (on first site load) */}
      <AnimatePresence>
        {showWelcome && (
          <CinematicLoader onComplete={handleWelcomeComplete} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <AnimatePresence mode="wait">
          {!profile ? (
            
            /* 2. Authentication Step (OTP & Interests onboarding) */
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OTPAuth onSuccess={handleOnboardingSuccess} />
            </motion.div>

          ) : (

            /* 3. Primary Workspace Dashboard */
            <motion.div
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col min-h-screen pb-32"
            >
              
              {/* Premium Top Navigation header */}
              <header className="sticky top-0 z-30 bg-slate-950/60 backdrop-blur-3xl border-b border-white/5 px-4 md:px-8 py-3 flex items-center justify-between">
                
                {/* Brand Logo & Slogan */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center font-mono font-extrabold text-[#020617] text-xl shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                    M
                  </div>
                  <div>
                    <h1 className="text-sm font-extrabold font-mono tracking-widest text-slate-100">
                      MINTOR.IN
                    </h1>
                    <span className="text-[9px] font-mono text-cyan-400 tracking-wider block uppercase mt-0.5">
                      Search Smart. Learn Faster.
                    </span>
                  </div>
                </div>

                {/* Center Live Coordinates clock */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 text-[9px] font-mono text-slate-500 uppercase">
                  <Shield className="w-3 h-3 text-cyan-500 animate-pulse" />
                  <span>SECURE CONNECTED • {currentUtcTime}</span>
                </div>

                {/* Right side Profile readout & Logout */}
                <div className="flex items-center gap-4">
                  
                  {/* XP badge display indicator */}
                  <div className="text-right flex flex-col items-end">
                    <span className="block text-[8px] font-mono text-slate-500 uppercase">Syllabus Rank</span>
                    <span className="text-xs font-bold text-cyan-400 font-mono tracking-tight uppercase">
                      🏅 {profile.xp} XP
                    </span>
                  </div>

                  {/* Profile capsule with name */}
                  <div className="flex items-center gap-2 p-1.5 px-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs font-mono">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-300 font-bold max-w-[80px] truncate">{profile.name}</span>
                  </div>

                  <button
                    onClick={handleLogOut}
                    title="Sign Out Session"
                    className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>

                </div>

              </header>

              {/* Cyber Grid Background Structure */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.25)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_80%,transparent_100%)] z-0"></div>

              {/* Main Content Arena */}
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 relative z-10">
                
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: SEARCH MACHINE */}
                  {activeTab === "search" && (
                    <motion.div
                      key="search-engine"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                    >
                      <SearchEngine onEarnXP={handleEarnXP} />
                    </motion.div>
                  )}

                  {/* TAB 2: STUDY HUB COGNITION */}
                  {activeTab === "study" && (
                    <motion.div
                      key="study-hub"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                    >
                      <StudyHub profile={profile} onEarnXP={handleEarnXP} />
                    </motion.div>
                  )}

                  {/* TAB 3: LIVE IPL TICKER */}
                  {activeTab === "cricket" && (
                    <motion.div
                      key="cricket-scores"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                    >
                      <CricketScores />
                    </motion.div>
                  )}

                  {/* TAB 4: AI SUMMARY NEWS BULLETIN */}
                  {activeTab === "news" && (
                    <motion.div
                      key="news-feed"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                    >
                      <NewsFeed />
                    </motion.div>
                  )}

                  {/* TAB 5: MULTIPLAYER QUIZ MATCH */}
                  {activeTab === "quiz" && (
                    <motion.div
                      key="quiz-battles"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                    >
                      <QuizSection
                        streak={profile.streak}
                        xp={profile.xp}
                        badges={profile.badges}
                        onEarnXP={handleEarnXP}
                        onUnlockBadge={handleUnlockBadge}
                      />
                    </motion.div>
                  )}

                </AnimatePresence>

              </main>

              {/* Interactive Float Chat doubts solver bottom right */}
              <AIChatBot />

              {/* FLOATING HUD DOCK MENU (Apple VisionOS-inspired glass container) */}
              <nav className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 font-mono pointer-events-none">
                <div className="pointer-events-auto bg-slate-950/75 backdrop-blur-2xl border border-white/10 p-2.5 rounded-3xl flex items-center gap-1.5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden">
                  
                  {/* Light accent glow inside dock bar */}
                  <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                  
                  {/* Opt: Search */}
                  <button
                    onClick={() => setActiveTab("search")}
                    className={`flex flex-col items-center justify-center p-3 px-4.5 rounded-2xl transition-all cursor-pointer relative group ${
                      activeTab === "search"
                        ? "bg-white/10 text-cyan-400"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Compass className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] uppercase font-bold tracking-widest mt-1.5">Search</span>
                  </button>

                  {/* Opt: Study Hub */}
                  <button
                    onClick={() => setActiveTab("study")}
                    className={`flex flex-col items-center justify-center p-3 px-4.5 rounded-2xl transition-all cursor-pointer relative group ${
                      activeTab === "study"
                        ? "bg-white/10 text-blue-400"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] uppercase font-bold tracking-widest mt-1.5">Study</span>
                  </button>

                  {/* Opt: Live Cricket */}
                  <button
                    onClick={() => setActiveTab("cricket")}
                    className={`flex flex-col items-center justify-center p-3 px-4.5 rounded-2xl transition-all cursor-pointer relative group ${
                      activeTab === "cricket"
                        ? "bg-white/10 text-amber-400"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Flame className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] uppercase font-bold tracking-widest mt-1.5">Cricket</span>
                  </button>

                  {/* Opt: AI News */}
                  <button
                    onClick={() => setActiveTab("news")}
                    className={`flex flex-col items-center justify-center p-3 px-4.5 rounded-2xl transition-all cursor-pointer relative group ${
                      activeTab === "news"
                        ? "bg-white/10 text-purple-400"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Newspaper className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] uppercase font-bold tracking-widest mt-1.5">News</span>
                  </button>

                  {/* Opt: MCQ Quiz */}
                  <button
                    onClick={() => setActiveTab("quiz")}
                    className={`flex flex-col items-center justify-center p-3 px-4.5 rounded-2xl transition-all cursor-pointer relative group ${
                      activeTab === "quiz"
                        ? "bg-white/10 text-emerald-400"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] uppercase font-bold tracking-widest mt-1.5">Battles</span>
                  </button>

                </div>
              </nav>

              {/* GLOBAL SYSTEM LOG NOTIFICATION DISPATCHER */}
              <AnimatePresence>
                {sysNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: 50, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: 50, x: "-50%" }}
                    className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 p-4.5 px-6 rounded-2xl bg-slate-900/90 [box-shadow:0_15px_30px_rgba(0,0,0,0.8)] border border-cyan-500/20 backdrop-blur-3xl text-xs font-mono text-cyan-300 max-w-sm flex items-center gap-3"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{sysNotice}</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>

          )}
        </AnimatePresence>
      )}

    </div>
  );
}
