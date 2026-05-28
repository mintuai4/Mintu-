import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Zap, Calendar, Trophy, ChevronRight, Activity } from "lucide-react";

interface MatchState {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  batsmanScore: number;
  batsmanBalls: number;
}

export default function CricketScores() {
  const [activeTab, setActiveTab] = useState<"live" | "schedule" | "points">("live");
  
  // Real-time IPL score state simulation
  const [match, setMatch] = useState<MatchState>({
    runs: 168,
    wickets: 4,
    overs: 17,
    balls: 2,
    batsmanScore: 58,
    batsmanBalls: 34
  });

  const [lastEvent, setLastEvent] = useState("Last Ball: 1 Run (Push to long-on)");

  useEffect(() => {
    const interval = setInterval(() => {
      setMatch((prev) => {
        let nBalls = prev.balls + 1;
        let nOvers = prev.overs;
        if (nBalls >= 6) {
          nBalls = 0;
          nOvers += 1;
        }

        if (nOvers >= 20) {
          return { runs: 168, wickets: 4, overs: 17, balls: 2, batsmanScore: 58, batsmanBalls: 34 };
        }

        // Random ball event trigger
        const rand = Math.random();
        let addedRuns = 0;
        let wicketOut = 0;
        let eventDesc = "";

        if (rand < 0.45) {
          addedRuns = 1;
          eventDesc = "Last Ball: 1 Run (Tucked to fine leg)";
        } else if (rand < 0.7) {
          addedRuns = 4;
          eventDesc = "FOUR! Cracking cover drive down the fast outfield!";
        } else if (rand < 0.85) {
          addedRuns = 6;
          eventDesc = "SIX! High and handsome over deep mid-wicket trajectory!";
        } else if (rand < 0.95) {
          addedRuns = 0;
          eventDesc = "Dot ball. Excellent defensive length by the bowler.";
        } else {
          wicketOut = 1;
          eventDesc = "OUT! Caught at deep square-leg while attempting a pull!";
        }

        setLastEvent(eventDesc);

        const newRuns = prev.runs + addedRuns;
        const newWickets = prev.wickets + wicketOut > 9 ? 9 : prev.wickets + wicketOut;
        const newBatScore = wicketOut ? 0 : prev.batsmanScore + addedRuns;
        const newBatBalls = wicketOut ? 0 : prev.batsmanBalls + 1;

        return {
          runs: newRuns,
          wickets: newWickets,
          overs: nOvers,
          balls: nBalls,
          batsmanScore: newBatScore,
          batsmanBalls: newBatBalls
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const pointsTable = [
    { rank: 1, team: "Gujarat Titans", played: 14, won: 10, lost: 4, points: 20, nrr: "+0.803" },
    { rank: 2, team: "Chennai Super Kings", played: 14, won: 9, lost: 5, points: 18, nrr: "+0.652" },
    { rank: 3, team: "Mumbai Indians", played: 14, won: 8, lost: 6, points: 16, nrr: "+0.450" },
    { rank: 4, team: "Royal Challengers Bengaluru", played: 14, won: 7, lost: 7, points: 14, nrr: "+0.135" },
    { rank: 5, team: "Kolkata Knight Riders", played: 14, won: 6, lost: 8, points: 12, nrr: "-0.280" }
  ];

  const upComingMatches = [
    { id: "s1", date: "May 29, 2026", time: "19:30 IST", teams: ["Mumbai Indians", "Rajasthan Royals"], venue: "Wankhede Stadium, Mumbai" },
    { id: "s2", date: "May 30, 2026", time: "19:30 IST", teams: ["Chennai Super Kings", "Royal Challengers Bengaluru"], venue: "M. Chinnaswamy Stadium, Bengaluru" },
    { id: "s3", date: "June 01, 2026", time: "15:30 IST", teams: ["Kolkata Knight Riders", "Delhi Capitals"], venue: "Eden Gardens, Kolkata" }
  ];

  return (
    <div className="relative font-sans text-white">
      
      {/* Category selector */}
      <div className="flex gap-2.5 mb-6 p-1 bg-white/[0.02] border border-white/5 rounded-xl max-w-sm">
        <button
          onClick={() => setActiveTab("live")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
            activeTab === "live"
              ? "bg-white/[0.08] text-cyan-400 border border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Live Tick
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
            activeTab === "schedule"
              ? "bg-white/[0.08] text-purple-400 border border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Schedule
        </button>
        <button
          onClick={() => setActiveTab("points")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
            activeTab === "points"
              ? "bg-white/[0.08] text-emerald-400 border border-white/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Trophy className="w-3.5 h-3.5" /> Table
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Live scorer screen */}
        {activeTab === "live" && (
          <motion.div
            key="cricket-live"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Main Scoreboard Card */}
            <div className="md:col-span-2 relative p-6 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-cyan-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">IPL Super League - LIVE MATCH</span>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-mono uppercase tracking-wider animate-pulse">
                  ● Ball by Ball Updates
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-mono tracking-tight text-slate-200">MI vs CSK</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Wankhede Stadium, Mumbai</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-extrabold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                    {match.runs}/{match.wickets}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Overs: {match.overs}.{match.balls} / 20.0
                  </div>
                </div>
              </div>

              {/* Batting/Bowling layout */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">Striker</div>
                  <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                    <span className="text-xs font-mono font-bold text-slate-200">V. Kohli*</span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{match.batsmanScore} ({match.batsmanBalls}b)</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">Active Bowler</div>
                  <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                    <span className="text-xs font-mono font-bold text-slate-200">R. Jadeja</span>
                    <span className="text-xs font-mono text-purple-400 font-bold">2.4 - 0 - 18 - 1</span>
                  </div>
                </div>
              </div>

              {/* Match live ticker strip */}
              <div className="mt-6 bg-cyan-950/20 border border-cyan-500/25 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="p-1 px-2.5 rounded bg-cyan-500 text-black text-[9px] font-extrabold font-mono uppercase tracking-wider">
                  Event
                </div>
                <div className="text-xs font-mono text-cyan-300">
                  {lastEvent}
                </div>
              </div>
            </div>

            {/* Match Quick Analysis info card */}
            <div className="relative p-6 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl" />
              <h4 className="text-xs font-bold font-mono tracking-wider text-purple-400 uppercase mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" /> Live Highlights
              </h4>
              <ul className="space-y-4 font-mono text-xs">
                <li className="flex items-start gap-2.5 text-slate-300">
                  <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>CSK opted to field first after winning the structural coin toss.</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-300">
                  <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Furious Powerplay starts: Mumbai scored 58 runs inside 6 overs.</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-300">
                  <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Virat Kohli structural partnership boosts baseline score rapidly.</span>
                </li>
              </ul>
              
              <div className="mt-8 flex justify-between items-center bg-gradient-to-r from-purple-950/20 to-slate-900 border border-purple-500/20 p-4 rounded-2xl">
                <div>
                  <span className="block text-[8px] uppercase text-slate-400 font-mono">Current Run Rate</span>
                  <span className="text-lg font-bold text-white font-mono">{(match.runs / (match.overs + match.balls/6)).toFixed(2)}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase text-slate-400 font-mono">Predicted Total</span>
                  <span className="text-lg font-bold text-cyan-400 font-mono">{Math.round((match.runs / (match.overs + match.balls/6)) * 20)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Schedule Screen */}
        {activeTab === "schedule" && (
          <motion.div
            key="cricket-sched"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {upComingMatches.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-purple-500/20 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-mono text-slate-300">{m.date} - {m.time}</span>
                  </div>
                  <h4 className="text-sm font-bold font-mono text-slate-100">{m.teams[0]} <span className="text-slate-500 font-light">vs</span> {m.teams[1]}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{m.venue}</p>
                </div>
                <button
                  type="button"
                  className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/35 text-purple-400 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all uppercase cursor-pointer"
                >
                  Set Reminder
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Points Table Screen */}
        {activeTab === "points" && (
          <motion.div
            key="cricket-points"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="overflow-x-auto"
          >
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Team Franchise</th>
                  <th className="py-3 px-4">P</th>
                  <th className="py-3 px-4">W</th>
                  <th className="py-3 px-4">L</th>
                  <th className="py-3 px-4 font-bold text-center">PTS</th>
                  <th className="py-3 px-4">NRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {pointsTable.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-cyan-400">{item.rank}</td>
                    <td className="py-3 px-4 font-bold text-slate-200">{item.team}</td>
                    <td className="py-3 px-4 text-slate-400">{item.played}</td>
                    <td className="py-3 px-4 text-emerald-400">{item.won}</td>
                    <td className="py-3 px-4 text-rose-400/80">{item.lost}</td>
                    <td className="py-3 px-4 font-extrabold text-cyan-300 text-center">{item.points}</td>
                    <td className="py-3 px-4 text-slate-400">{item.nrr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
