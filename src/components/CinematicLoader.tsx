import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, ShieldCheck, Cpu } from "lucide-react";

interface CinematicLoaderProps {
  onComplete: () => void;
}

export default function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "Welcome to Mintor AI Search",
    "Initializing Neural Search Matrix...",
    "Securing VisionOS Glass Sandbox...",
    "Establishing Intelligent Link..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 35);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 25) setActiveStep(0);
    else if (progress < 50) setActiveStep(1);
    else if (progress < 80) setActiveStep(2);
    else setActiveStep(3);

    if (progress === 100) {
      const finishTimeout = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(finishTimeout);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-radial from-slate-950 via-[#010208] to-black text-white overflow-hidden font-sans">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.3)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Holographic scanner effect line */}
      <motion.div 
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] opacity-35"
      />

      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        
        {/* Floating Futuristic Mintor Symbol */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mb-10"
        >
          {/* Outer Rotating Liquid Orb */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-[38%] blur-md opacity-30 animate-spin [animation-duration:8s]"></div>
          
          <div className="relative w-28 h-28 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            {/* Liquid glass light reflection */}
            <motion.div 
              animate={{ x: ["-100%", "100%"], y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
            
            {/* Shiny Digital Emblem */}
            <span className="text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-300 to-purple-200 drop-shadow-[0_2px_10px_rgba(34,211,238,0.4)] font-mono">
              M
            </span>
          </div>
        </motion.div>

        {/* Brand Name Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 font-mono"
        >
          MINTOR.IN
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5 }}
          className="text-xs tracking-widest text-cyan-400 mt-2 font-mono uppercase"
        >
          Search Smart. Learn Faster.
        </motion.p>

        {/* Animated Hologram Diagnostic Steps */}
        <div className="h-14 mt-10 w-full flex items-center justify-center font-mono">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 text-sm font-light text-slate-300 bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-full backdrop-blur-md"
            >
              {activeStep === 0 && <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />}
              {activeStep === 1 && <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />}
              {activeStep === 2 && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              {activeStep === 3 && <Terminal className="w-4 h-4 text-blue-400" />}
              <span>{steps[activeStep]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Luxurious Progress Glass Slider */}
        <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden mt-6 border border-white/5 shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_#06b6d4]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[10px] font-mono text-slate-500 tracking-widest mt-3 uppercase">
          System Load: {progress}%
        </div>

      </div>

      {/* Decorative Border Glows */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent shadow-[0_1px_15px_rgba(6,182,212,0.5)]"></div>
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/35 to-transparent shadow-[0_-1px_15px_rgba(168,85,247,0.5)]"></div>
    </div>
  );
}
