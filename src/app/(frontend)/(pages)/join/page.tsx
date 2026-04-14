"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  Code, 
  Heart,
  Terminal,
  Layers,
  ChevronDown,
  Users,
  Coffee,
  Quote,
  MessageSquare,
  Rocket
} from "lucide-react";

export default function JoinCommunityPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    email: "", name: "", role: "", experience: "", interest: [] as string[], whyJoin: ""
  });

  const secondaryWord = "Together";
  const interests = ["Web Dev", "Mobile", "AI/ML", "Cloud", "DevOps", "UI/UX", "OS", "Startups"];
  const roles = ["Student", "Professional", "Freelancer", "Entrepreneur", "Designer", "Other"];
  const expLevels = [
    "No Experience",
    "Student",
    "Beginner (0-1 years)",
    "Intermediate (1-3 years)",
    "Advanced (3-5 years)",
    "Expert (5+ years)",
  ];

  const handleInterestToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      interest: prev.interest.includes(item) 
        ? prev.interest.filter(i => i !== item) 
        : [...prev.interest, item]
    }));
  };

  const validateStep1 = () => {
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrors({ email: "A valid email is required" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    // Only Name and Email are strictly required
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(data.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">You&apos;re in the Force!</h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Check your inbox for your <strong>Member Certificate</strong>. 
            Welcome to D4.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#fd7d6e]/30 pt-20 pb-20 px-6 transition-colors duration-300">
      
      {/* --- GLOBAL LOADER OVERLAY --- */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <Loader2 className="w-12 h-12 text-[#fd7d6e] animate-spin mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Processing Application</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto">
        
        {/* --- HERO SECTION --- */}
        <div className="max-w-xl mx-auto mb-24 mt-4">
          <div className="mb-10 text-center">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-muted-foreground text-[10px] uppercase tracking-widest mb-6">
              <Sparkles size={12} className="text-[#fd7d6e]" /> Membership Application
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Let&apos;s Build{" "}
              <span className="text-[#fd7d6e]">
                {secondaryWord.split("").map((char, idx) => (
                  <motion.span key={idx} className="inline-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}>
                    {char}
                  </motion.span>
                ))}
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground opacity-70">
              <p className="flex items-center gap-2">
                <Code size={14} className="text-[#fd7d6e]" /> Showcase Projects
              </p>
              <span className="hidden sm:block opacity-20">•</span>
              <p className="flex items-center gap-2">
                <Heart size={14} className="text-[#fd7d6e]" /> Grow Together
              </p>
            </div>
          </div>

          {/* --- FORM CARD --- */}
          <div className="bg-card border border-border rounded-[2.195rem] p-6 md:p-8 relative shadow-sm overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#fd7d6e]/5 blur-3xl rounded-full pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="relative group">
                    <input 
                      type="email" 
                      placeholder="dev@example.com"
                      className={`w-full bg-background border ${errors.email ? 'border-red-500' : 'border-input'} rounded-2xl px-6 py-4 outline-none focus:border-[#fd7d6e] transition-all`}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <button 
                      onClick={() => validateStep1() && setStep(2)}
                      className="absolute right-2 top-2 bottom-2 bg-[#fd7d6e] text-white px-4 rounded-xl hover:opacity-90 transition-all group/btn"
                    >
                      <ArrowRight size={18} className="transition-transform duration-300 -rotate-45 group-hover/btn:rotate-0" />
                    </button>
                  </div>
                  {errors.email && <p className="text-red-500 text-[10px] mt-2 ml-2">{errors.email}</p>}
                  
                  {/* Step Heading Below */}
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60 mt-4 text-start">Step 01 - Account Setup</p>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name *</p>
                      <input 
                        className={`w-full bg-background border ${errors.name ? 'border-red-500' : 'border-input'} rounded-xl px-4 py-3 text-sm outline-none focus:border-[#fd7d6e]`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                      {errors.name && <p className="text-red-500 text-[9px] ml-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Current Role</p>
                      <div className="relative">
                        <select 
                          className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm outline-none appearance-none focus:border-[#fd7d6e]"
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                          <option value="">Select Role</option>
                          {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Experience Level</p>
                    <div className="relative">
                      <select 
                        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm outline-none appearance-none focus:border-[#fd7d6e]"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      >
                        <option value="">Choose Level</option>
                        {expLevels.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Areas of Interest</p>
                    <div className="flex flex-wrap gap-2">
                      {interests.map(item => (
                        <button
                          key={item} type="button"
                          onClick={() => handleInterestToggle(item)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-semibold border transition-all ${
                            formData.interest.includes(item) ? "bg-[#fd7d6e] border-[#fd7d6e] text-white" : "bg-muted/30 border-border text-muted-foreground"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Why D4 Community?</p>
                    <textarea 
                      className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm outline-none focus:border-[#fd7d6e] min-h-[80px] resize-none"
                      placeholder="Share your goals..."
                      value={formData.whyJoin}
                      onChange={(e) => setFormData({...formData, whyJoin: e.target.value})}
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button 
                      onClick={handleSubmit}
                      className="w-full bg-[#fd7d6e] text-white py-4 rounded-2xl font-bold hover:bg-[#fd7d6e]/90 transition-all flex items-center justify-center gap-2 group/submit"
                    >
                      Join Community
                      <ArrowRight size={18} className="transition-transform duration-300 -rotate-45 group-hover/submit:rotate-0" />
                    </button>
                    <button onClick={() => setStep(1)} className="text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors">Back</button>
                  </div>

                  {/* Step Heading Below */}
                  <p className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground/60 mt-4 text-start">Step 02 - Personal Details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- DYNAMIC FEATURE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-fr mb-32">
          <motion.div whileHover={{ y: -5 }} className="md:col-span-7 p-8 rounded-[2.5rem] bg-card border border-border">
            <Rocket className="text-[#fd7d6e] mb-6" size={28} />
            <h4 className="text-xl font-bold mb-3">Project Showcase</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Give your side projects, hobby code, and serious ventures a place to breathe. Invite collaborators and inspire other builders within the ecosystem.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="md:col-span-5 p-8 rounded-[2.5rem] bg-secondary/20 border border-border">
            <MessageSquare className="text-[#6d9eeb] mb-6" size={28} />
            <h4 className="text-xl font-bold mb-3">Speak & Listen</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We discuss, we grow. Share ideas and get feedback from people who love the craft as much as you do.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="md:col-span-5 p-8 rounded-[2.5rem] bg-[#6d9eeb]/5 border border-[#6d9eeb]/20">
            <Terminal className="text-[#6d9eeb] mb-6" size={28} />
            <h4 className="text-xl font-bold mb-3">Shared Logic</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Stuck on a tricky bug? Tap into our collective brainpower. Four eyes are always better than two.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="md:col-span-7 p-8 rounded-[2.5rem] bg-card border border-border">
            <Layers className="text-[#fd7d6e] mb-6" size={28} />
            <h4 className="text-xl font-bold mb-3">The D4 Library</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Access member-only resources, curated learning paths, and internal documentation to stay ahead of the curve.
            </p>
          </motion.div>
        </div>

        {/* --- PHILOSOPHY SECTION --- */}
        <div className="mb-32 relative">
          <div className="flex items-center gap-4 mb-12 text-muted-foreground/30">
            <div className="h-px flex-1 bg-border" />
            <h3 className="text-[10px] uppercase tracking-[0.5em]">The Philosophy</h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <span className="text-[#fd7d6e] font-mono text-xs">01.</span>
              <h4 className="font-bold text-lg italic">&quot;Learn by Doing&quot;</h4>
              <p className="text-muted-foreground text-sm">Theory is good, but building is better. We prioritize execution over endless planning.</p>
            </div>
            <div className="space-y-4">
              <span className="text-[#6d9eeb] font-mono text-xs">02.</span>
              <h4 className="font-bold text-lg italic">&quot;Radical Candor&quot;</h4>
              <p className="text-muted-foreground text-sm">We give honest, direct feedback to help each other grow. No fluff, just progress.</p>
            </div>
            <div className="space-y-4">
              <span className="text-[#fd7d6e] font-mono text-xs">03.</span>
              <h4 className="font-bold text-lg italic">&quot;Open Shipping&quot;</h4>
              <p className="text-muted-foreground text-sm">Everything is better when shared. We celebrate deployments, big or small.</p>
            </div>
          </div>
          <Quote className="absolute -bottom-36 -right-4 w-40 h-40 text-white/10 rotate-12" />
        </div>

        {/* --- FOOTER --- */}
        <footer className="pt-12 border-t border-border/50 text-center">
          <div className="flex items-center justify-center gap-8 mb-8 grayscale opacity-40">
            <Coffee size={20} />
            <Users size={20} />
            <Code size={20} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            Discite • Develop • Debug • Deploy
          </p>
          <p className="mt-4 text-[9px] text-muted-foreground/40">© 2026 D4 Community. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}