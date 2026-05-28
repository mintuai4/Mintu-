import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, PhoneCall, Mail, Fingerprint, Sparkles, BookOpen, MessageSquare, Flame } from "lucide-react";

interface OTPAuthProps {
  onSuccess: (profile: { name: string; emailOrPhone: string; interests: string[] }) => void;
}

const ALL_INTERESTS = [
  { id: "study", label: "Study Hub (Electrician ITI)", icon: BookOpen },
  { id: "youtube", label: "YouTube Lessons", icon: Sparkles },
  { id: "cricket", label: "IPL & Cricket Live", icon: Flame },
  { id: "news", label: "AI Tech News", icon: ShieldCheck },
  { id: "quiz", label: "Quiz Practice Battles", icon: Sparkles },
  { id: "ai", label: "AI doubt Solver", icon: MessageSquare }
];

export default function OTPAuth({ onSuccess }: OTPAuthProps) {
  const [step, setStep] = useState<"input" | "otp" | "profile">("input");
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [inputValue, setInputValue] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [authLogs, setAuthLogs] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleSendOTP = () => {
    if (!inputValue || inputValue.length < 5) {
      setErrorText(method === "phone" ? "Please enter valid mobile number." : "Please enter valid email address.");
      return;
    }
    setErrorText("");
    setAuthLogs([
      "📡 Handshake initiated with VisionOS Auth daemon...",
      `⚡ Dispatched verification hash to ${inputValue}`,
      "🔒 Secure virtual OTP envelope sealed with TLS 1.3"
    ]);

    setStep("otp");
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const fullCode = otpDigits.join("");
    if (fullCode.length < 6) {
      setErrorText("Please fill out complete six-digit security pin.");
      return;
    }
    setErrorText("");
    
    // Simulate validation
    setAuthLogs((prev) => [
      ...prev,
      "🗝️ Decrypting verification hash...",
      "💚 Dynamic code matched with secure server registry!",
      "👤 Creating sandboxed user identity container..."
    ]);

    setTimeout(() => {
      setStep("profile");
    }, 1200);
  };

  const handleSaveProfile = () => {
    if (!userName.trim()) {
      setErrorText("Please state your name for personalized search greeting.");
      return;
    }
    if (selectedInterests.length === 0) {
      setErrorText("Kindly pick at least 1 focus area to load your dynamic dashboard.");
      return;
    }

    onSuccess({
      name: userName,
      emailOrPhone: inputValue,
      interests: selectedInterests
    });
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-950 via-[#070913] to-black px-4 py-12 relative text-white font-sans overflow-hidden">
      
      {/* Visual Ambient Orbs */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.2)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>

      <AnimatePresence mode="wait">
        
        {/* Step 1: Phone / Email Selection */}
        {step === "input" && (
          <motion.div
            key="input-screen"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            className="w-full max-w-md relative p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
          >
            {/* Glossy Reflection Card Edge */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <Fingerprint className="w-8 h-8 text-black" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent font-mono">
              Secure Auth Environment
            </h2>
            <p className="text-xs text-slate-400 text-center mb-8">
              Verify your coordinates to access premium workspace.
            </p>

            <div className="flex gap-2.5 mb-6 p-1 bg-white/[0.04] rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => { setMethod("phone"); setInputValue(""); setErrorText(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono tracking-wider rounded-lg transition-all ${
                  method === "phone"
                    ? "bg-white/[0.08] text-cyan-400 shadow-md border border-white/10"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" /> Mobile
              </button>
              <button
                type="button"
                onClick={() => { setMethod("email"); setInputValue(""); setErrorText(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono tracking-wider rounded-lg transition-all ${
                  method === "email"
                    ? "bg-white/[0.08] text-purple-400 shadow-md border border-white/10"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
            </div>

            <div className="relative mb-6">
              <input
                type={method === "phone" ? "tel" : "email"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={method === "phone" ? "+91 XXXXX XXXXX" : "student@mintor.in"}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-white placeholder-slate-600"
              />
              <span className="absolute top-3.5 right-4 text-xs font-mono text-cyan-400/40">SECURE</span>
            </div>

            {errorText && (
              <p className="text-rose-500 text-xs text-center font-mono mb-4">{errorText}</p>
            )}

            <button
              onClick={handleSendOTP}
              className="w-full py-3.5 rounded-xl text-black font-semibold tracking-wider text-sm font-mono bg-gradient-to-r from-cyan-400 to-blue-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              GENERATE SECURE OTP
            </button>
          </motion.div>
        )}

        {/* Step 2: OTP Verification Dial */}
        {step === "otp" && (
          <motion.div
            key="otp-screen"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            className="w-full max-w-md relative p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <ShieldCheck className="w-8 h-8 text-black" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent font-mono">
              Verify Digital Key
            </h2>
            <p className="text-xs text-slate-400 text-center mb-8">
              Code dispatched to <span className="text-cyan-400 font-mono">{inputValue}</span>
            </p>

            <div className="flex justify-between gap-2.5 mb-6">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-14 bg-black/50 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-center text-xl font-mono text-cyan-300 focus:outline-none transition-all"
                />
              ))}
            </div>

            {errorText && (
              <p className="text-rose-500 text-xs text-center font-mono mb-4">{errorText}</p>
            )}

            <button
              onClick={handleVerifyOTP}
              className="w-full py-3.5 rounded-xl text-black font-semibold tracking-wider text-sm font-mono bg-gradient-to-r from-purple-400 to-pink-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] active:scale-95 transition-all cursor-pointer flex items-center justify-center mb-6"
            >
              VERIFY CREDENTIALS
            </button>

            {/* Simulated Cryptographic Daemon Logs */}
            <div className="p-3 bg-black/60 rounded-xl border border-white/5 font-mono text-[10px] text-slate-400 space-y-1">
              {authLogs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-cyan-400">❯</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Profile Setup Form Onboarding */}
        {step === "profile" && (
          <motion.div
            key="profile-screen"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            className="w-full max-w-xl relative p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center tracking-tight mb-1 bg-gradient-to-r from-white over to-slate-300 bg-clip-text text-transparent font-mono">
              Welcome to Mintor.in
            </h2>
            <p className="text-xs text-slate-400 text-center mb-8">
              Configure your liquid sandbox preferences to boot up
            </p>

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">
                What should we call you?
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-white placeholder-slate-600"
              />
            </div>

            {/* Interests checklist */}
            <div className="mb-8">
              <label className="block text-xs font-mono text-slate-400 mb-3 uppercase tracking-wide">
                Select focus coordinates (at least 1)
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_INTERESTS.map((interest) => {
                  const Icon = interest.icon;
                  const selected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                        selected
                          ? "bg-gradient-to-r from-cyan-950/40 to-slate-900 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selected ? "bg-cyan-500 text-black" : "bg-white/5 text-slate-400"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-mono transition-colors ${selected ? "text-cyan-300 font-semibold" : "text-slate-300"}`}>
                        {interest.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {errorText && (
              <p className="text-rose-500 text-xs text-center font-mono mb-4">{errorText}</p>
            )}

            <button
              onClick={handleSaveProfile}
              className="w-full py-4 rounded-xl text-black font-extrabold tracking-widest text-xs font-mono bg-gradient-to-r from-emerald-400 to-teal-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 transition-all cursor-pointer flex items-center justify-center. "
            >
              INITIALIZE ENVIRONMENT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
