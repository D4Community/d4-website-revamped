"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Users,
  MessageSquare,
  Sparkles,
  X,
  Loader2,
  Mail,
  ExternalLink,
  Bot,
  MessageCircle,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  UserPlus,
  SendHorizonal,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

// ===================== CONFIGURATION =====================
const COMMUNITY_LINKS = [
  {
    label: "WhatsApp Group",
    icon: <MessageCircle size={14} />,
    link: "https://chat.whatsapp.com/Khwy3LEyjdX4Kx8VJ1MXmW",
    bg: "bg-green-50 dark:bg-green-950/30",
    color: "text-green-600 dark:text-green-400",
  },
  {
    label: "WhatsApp Channel",
    icon: <SendHorizonal size={14} />,
    link: "https://whatsapp.com/channel/0029Va8QbTU8V0trPdleNl2I",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "LinkedIn",
    icon: <Linkedin size={14} />,
    link: "https://www.linkedin.com/company/d4community",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "GitHub",
    icon: <Github size={14} />,
    link: "https://github.com/D4Community",
    bg: "bg-gray-100 dark:bg-gray-800/50",
    color: "text-gray-700 dark:text-gray-300",
  },
  {
    label: "Twitter / X",
    icon: <Twitter size={14} />,
    link: "https://twitter.com/D4community",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    label: "Instagram",
    icon: <Instagram size={14} />,
    link: "https://www.instagram.com/d4community",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    color: "text-pink-600 dark:text-pink-400",
  },
  {
    label: "YouTube",
    icon: <Youtube size={14} />,
    link: "https://www.youtube.com/@d4-community",
    bg: "bg-red-50 dark:bg-red-950/30",
    color: "text-red-600 dark:text-red-400",
  },
  {
    label: "Commudle",
    icon: <Globe size={14} />,
    link: "https://www.commudle.com/communities/d4-community",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    label: "Discord Server",
    icon: <Users size={14} />,
    link: "https://discord.com/invite/RPpYB8JpUQ",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    label: "Become a Volunteer",
    icon: <UserPlus size={14} />,
    link: "https://forms.gle/CY8eDostKx2t8Wx49",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    color: "text-rose-600 dark:text-rose-400",
  },
];

// ===================== VALIDATION SCHEMA =====================
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  role: z.string().min(1, { message: "Please select your role." }),
  interest: z
    .array(z.string())
    .min(1, { message: "Please select at least one interest." }),
  experience: z
    .string()
    .min(1, { message: "Please select your experience level." }),
  subject: z.string().optional(),
  other: z.string().optional(),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// ===================== CONFETTI & LOADER =====================
function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const explode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const w = canvas.width, h = canvas.height;

    const pieces = Array.from({ length: 120 }).map(() => ({
      x: w / 2 + (Math.random() - 0.5) * 80,
      y: h / 2 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 1.5) * 9,
      r: 3 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      color: ["#fd7d6e", "#ff9a8b", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"][
        Math.floor(Math.random() * 6)
      ],
    }));

    let t0 = performance.now();
    function loop(t: number) {
      const dt = (t - t0) / 1000;
      t0 = t;
      ctx.clearRect(0, 0, w, h);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rot += 0.2;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      }
      if (pieces[0].y < h + 200) {
        requestAnimationFrame(loop);
      } else {
        setTimeout(() => ctx.clearRect(0, 0, w, h), 500);
      }
    }
    requestAnimationFrame(loop);
  };

  return { canvasRef, explode };
}

function DotsLoader({
  visible,
  durationMs = 1800,
  onComplete,
}: {
  visible: boolean;
  durationMs?: number;
  onComplete?: () => void;
}) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onComplete?.(), durationMs);
    return () => clearTimeout(t);
  }, [visible, durationMs, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-xl pointer-events-auto">
      <div className="text-center">
        <div className="inline-flex gap-4 items-end px-8 py-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          {[0, 0.15, 0.3].map((delay, i) => (
            <span
              key={i}
              className="w-4 h-4 rounded-full animate-bounce"
              style={{
                animationDelay: `${delay}s`,
                background: ["#fd7d6e", "#ff9a8b", "#fda58e"][i],
              }}
            />
          ))}
        </div>
        <p className="mt-5 text-base font-medium text-white/90">Processing your request…</p>
        <p className="mt-1 text-sm text-gray-400">Welcome to D4 Community!</p>
      </div>
    </div>
  );
}

// ===================== SECTION SEPARATOR =====================
const SectionSep = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 my-5">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-gray-100 dark:bg-white/8" />
  </div>
);

// ===================== INTEREST TAG =====================
const InterestTag = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <label
    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer select-none transition-all duration-200 ${
      checked
        ? "bg-[#fd7d6e]/10 border-[#fd7d6e]/40 text-[#d85a30] dark:text-[#ff9a8b]"
        : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#fd7d6e]/30 hover:text-[#d85a30] dark:hover:text-[#ff9a8b]"
    }`}
  >
    <input
      type="checkbox"
      className="hidden"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span
      className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
        checked
          ? "bg-[#fd7d6e] border-[#fd7d6e]"
          : "border-gray-300 dark:border-white/20"
      }`}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    {label}
  </label>
);

// ===================== FIELD COMPONENTS =====================
const FieldWrapper = ({ children, error }: { children: React.ReactNode; error?: string }) => (
  <div className="flex flex-col gap-1.5">
    {children}
    {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
  </div>
);

const FieldLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
    {children}
  </label>
);

const inputClass =
  "h-10 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#fd7d6e]/60 focus:outline-none focus:ring-2 focus:ring-[#fd7d6e]/15 transition-all duration-200 backdrop-blur-sm";

// ===================== CHAT INTERFACE =====================
interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  content: string;
  timestamp: Date;
}

const OFFLINE_RESPONSES: Record<string, string> = {
  "How to join?": "Join via our WhatsApp group or Discord — links are in the panel on the left! We'd love to have you.",
  "Upcoming events": "We regularly host hackathons, workshops, and meetups in Chandigarh. Join our WhatsApp group for announcements!",
  "What is D4?": "D4 Community is a Chandigarh-based tech community for developers, designers, and enthusiasts — focused on learning, building, and collaboration.",
  "Volunteer opportunities": "We're always looking for volunteers! Click 'Become a Volunteer' in the community links to apply.",
  "General questions": "For specific questions, please use the contact form and our team will respond within 24 hours!",
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "bot", content: "👋 Hello! I'm the D4 Community assistant. Ask me anything about our community, events, or how to join.", timestamp: new Date() },
    { id: "2", sender: "bot", content: "What would you like to know?", timestamp: new Date(Date.now() + 1000) },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = ["How to join?", "Upcoming events", "What is D4?", "Volunteer opportunities", "General questions"];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "bot", content, timestamp: new Date() },
    ]);
    setIsTyping(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", content: text, timestamp: new Date() }]);
    setUserInput("");
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 700));
    const resp = OFFLINE_RESPONSES[text] ?? "Thanks for reaching out! For detailed inquiries, please use the contact form — our team responds within 24 hours.";
    addBotMessage(resp + "\n\n💡 Tip: The contact form is the best way to connect with our team directly.");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#fd7d6e] to-[#ff9a8b] flex items-center justify-center shadow-md shadow-[#fd7d6e]/20">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">D4 Community assistant</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Online · Basic info mode</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium ml-1">Beta</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 space-y-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#fd7d6e] to-[#ff9a8b] flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-[#fd7d6e] to-[#ff9a8b] text-white rounded-br-sm shadow-md shadow-[#fd7d6e]/20"
                  : "bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-100 rounded-bl-sm"
              }`}
            >
              {msg.content}
              <div className={`text-[10px] mt-1.5 ${msg.sender === "user" ? "text-white/60" : "text-gray-400"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#fd7d6e] to-[#ff9a8b] flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="flex gap-1.5 px-3.5 py-2.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl rounded-bl-sm">
              {[0, 0.2, 0.4].map((d, i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick replies */}
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((r) => (
          <button
            key={r}
            onClick={() => handleSend(r)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:border-[#fd7d6e]/40 hover:text-[#d85a30] dark:hover:text-[#ff9a8b] transition-all duration-200"
          >
            {r}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className={`${inputClass} flex-1`}
          placeholder="Ask me about D4 Community…"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(userInput)}
        />
        <button
          onClick={() => handleSend(userInput)}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fd7d6e] to-[#ff9a8b] flex items-center justify-center text-white shadow-md shadow-[#fd7d6e]/20 hover:opacity-90 active:scale-95 transition-all duration-200 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ===================== SUCCESS MODAL =====================
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { canvasRef, explode } = useConfetti();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 10000);
      setTimeout(() => explode(), 220);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} className="pointer-events-none fixed inset-0 z-[1200] w-full h-full" aria-hidden />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-8 shadow-2xl"
        >
          <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fd7d6e] to-[#ff9a8b] flex items-center justify-center mb-5 shadow-lg shadow-[#fd7d6e]/30">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">You're awesome — thanks!</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              We received your application and will get back to you within 24 hours.
            </p>

            <div className="flex gap-3 mt-6">
              <a
                href={COMMUNITY_LINKS[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/30 hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Join WhatsApp
              </a>
              <a
                href="mailto:help.d4community@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/15 transition-colors"
              >
                <Mail className="w-4 h-4" /> Email us
              </a>
            </div>

            <button onClick={onClose} className="mt-4 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

// ===================== LEFT SIDEBAR =====================
const CommunityLinksSection = () => (
  <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl overflow-hidden shadow-sm">
    <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-[#fd7d6e]/10 flex items-center justify-center">
        <Users className="w-3.5 h-3.5 text-[#d85a30]" />
      </div>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">Community links</span>
    </div>
    <div className="p-3 flex flex-col gap-0.5">
      {COMMUNITY_LINKS.map((item) => (
        <a
          key={item.label}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-all duration-200 group"
        >
          <div className={`w-7 h-7 rounded-lg ${item.bg} ${item.color} flex items-center justify-center flex-shrink-0`}>
            {item.icon}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex-1 font-medium">
            {item.label}
          </span>
          <ExternalLink className="w-3 h-3 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-400 transition-colors" />
        </a>
      ))}
    </div>
  </div>
);

const ContactInfoSection = () => (
  <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl overflow-hidden shadow-sm">
    <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
      </div>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">Quick info</span>
    </div>
    <div className="p-4 flex flex-col gap-3">
      {[
        { icon: <Mail className="w-3.5 h-3.5" />, bg: "bg-blue-50 dark:bg-blue-950/30", color: "text-blue-500", label: "Email", val: "help.d4community@gmail.com", href: "mailto:help.d4community@gmail.com" },
        { icon: <Clock className="w-3.5 h-3.5" />, bg: "bg-green-50 dark:bg-green-950/30", color: "text-green-500", label: "Response time", val: "Within 24 hours" },
        { icon: <MapPin className="w-3.5 h-3.5" />, bg: "bg-purple-50 dark:bg-purple-950/30", color: "text-purple-500", label: "Location", val: "Chandigarh, India" },
      ].map((item) => (
        <div key={item.label} className="flex items-start gap-3">
          <div className={`w-7 h-7 rounded-lg ${item.bg} ${item.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
            {item.icon}
          </div>
          <div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">{item.label}</p>
            {item.href ? (
              <a href={item.href} className="text-sm text-blue-500 hover:underline font-medium break-all">{item.val}</a>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item.val}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ===================== CONTACT FORM SECTION =====================
const ContactFormSection = ({
  form,
  onSubmit,
  isLoading,
  serverError,
  interests,
  roles,
  experienceLevels,
}: any) => (
  <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl shadow-sm overflow-hidden">
    {/* Form header */}
    <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 bg-gradient-to-r from-gray-50/80 to-white dark:from-white/5 dark:to-transparent flex items-start justify-between gap-4">
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Join D4 Community</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tell us about yourself and how you'd like to be involved</p>
      </div>
      <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/30">
        Free
      </span>
    </div>

    <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-0">
      <SectionSep label="Personal info" />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <FieldWrapper error={form.formState.errors.name?.message}>
          <FieldLabel htmlFor="name">Full name *</FieldLabel>
          <input id="name" className={inputClass} placeholder="Iti Sharma" {...form.register("name")} />
        </FieldWrapper>

        <FieldWrapper error={form.formState.errors.email?.message}>
          <FieldLabel htmlFor="email">Email *</FieldLabel>
          <input id="email" className={inputClass} placeholder="iti@example.com" {...form.register("email")} />
        </FieldWrapper>

        <FieldWrapper error={form.formState.errors.phone?.message}>
          <FieldLabel htmlFor="phone">Phone *</FieldLabel>
          <input id="phone" className={inputClass} placeholder="+91 98765 43210" {...form.register("phone")} />
        </FieldWrapper>

        <FieldWrapper error={form.formState.errors.role?.message}>
          <FieldLabel htmlFor="role">Role *</FieldLabel>
          <select
            id="role"
            className={`${inputClass} cursor-pointer`}
            {...form.register("role")}
          >
            <option value="">Select your role</option>
            {roles.map((r: string) => <option key={r} value={r}>{r}</option>)}
          </select>
        </FieldWrapper>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-2">
        <FieldWrapper>
          <FieldLabel htmlFor="subject">Subject (optional)</FieldLabel>
          <input id="subject" className={inputClass} placeholder="e.g. Collaboration proposal" {...form.register("subject")} />
        </FieldWrapper>

        <FieldWrapper error={form.formState.errors.experience?.message}>
          <FieldLabel htmlFor="experience">Experience level *</FieldLabel>
          <select id="experience" className={`${inputClass} cursor-pointer`} {...form.register("experience")}>
            <option value="">Select level</option>
            {experienceLevels.map((l: string) => <option key={l} value={l}>{l}</option>)}
          </select>
        </FieldWrapper>
      </div>

      <SectionSep label="Areas of interest *" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
        {interests.map((item: string) => (
          <InterestTag
            key={item}
            label={item}
            checked={form.watch("interest")?.includes(item) ?? false}
            onChange={(checked) => {
              const current = form.watch("interest") ?? [];
              form.setValue(
                "interest",
                checked ? [...current, item] : current.filter((v: string) => v !== item)
              );
            }}
          />
        ))}
      </div>
      {form.formState.errors.interest && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1">{form.formState.errors.interest.message as string}</p>
      )}

      <SectionSep label="Your message" />

      <FieldWrapper error={form.formState.errors.message?.message}>
        <textarea
          className={`${inputClass} h-32 py-3 resize-y`}
          placeholder="Tell us why you want to join D4 Community, what projects you're working on, or any questions…"
          {...form.register("message")}
        />
      </FieldWrapper>

      {/* Terms */}
      <div className="flex items-start gap-3 mt-5 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            id="agreeToTerms"
            className="sr-only peer"
            {...form.register("agreeToTerms")}
          />
          <label
            htmlFor="agreeToTerms"
            className="w-4 h-4 rounded-sm border-2 border-gray-300 dark:border-white/20 peer-checked:bg-[#fd7d6e] peer-checked:border-[#fd7d6e] flex items-center justify-center cursor-pointer transition-all duration-200 block"
          >
            <svg className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </label>
        </div>
        <div>
          <label htmlFor="agreeToTerms" className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer">
            I agree to the terms and conditions
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            By submitting, you agree to receive communications from D4 Community about events, opportunities, and updates.
          </p>
          {form.formState.errors.agreeToTerms && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">{form.formState.errors.agreeToTerms.message as string}</p>
          )}
        </div>
      </div>

      {serverError && (
        <div className="mt-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {serverError}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#fd7d6e] to-[#ff9a8b] hover:from-[#f06b5c] hover:to-[#fd8c7a] shadow-md shadow-[#fd7d6e]/25 hover:shadow-lg hover:shadow-[#fd7d6e]/30 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit application
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          We typically respond within 24 hours
        </p>
      </div>
    </form>
  </div>
);

// ===================== MAIN COMPONENT =====================
export function D4ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "chat">("form");
  const [serverError, setServerError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "", email: "", phone: "", role: "",
      interest: [], experience: "", subject: "", other: "", message: "",
      agreeToTerms: false,
    },
  });

  const interests = [
    "Web Development", "Mobile Development", "AI/ML", "Cloud Computing",
    "DevOps", "UI/UX Design", "Open Source", "Startups", "Mentoring", "Hackathons", "Other",
  ];

  const roles = [
    "Student", "Professional Developer", "Beginner", "Freelancer",
    "Entrepreneur", "Researcher", "Designer", "Other",
  ];

  const experienceLevels = [
    "Beginner (0–1 years)", "Intermediate (1–3 years)",
    "Advanced (3–5 years)", "Expert (5+ years)",
  ];

  const onLoaderComplete = () => {
    setShowLoader(false);
    setIsLoading(false);
    if (serverError) return;
    setShowSuccess(true);
    form.reset();
  };

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setServerError(null);
    setIsLoading(true);
    setShowLoader(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Failed to send message");
      }
    } catch (err: any) {
      console.error(err);
      setServerError(err?.message || "Something went wrong. Please try again.");
      setShowLoader(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 mt-16">
      <DotsLoader visible={showLoader} durationMs={1800} onComplete={onLoaderComplete} />

      <div className="max-w-7xl mx-auto">
        {/* ── Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-br from-[#fd7d6e] via-[#ff9a8b] to-[#ffb3a0] p-8 md:p-12 shadow-xl shadow-[#fd7d6e]/20"
        >
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/8 pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-white/6 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/25 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-semibold text-white tracking-wide">D4 Community · Chandigarh</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
              Let's build{" "}
              <span className="text-white/80">together</span>
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-lg leading-relaxed">
              Connect with developers, designers, and tech enthusiasts. Whether you're looking to collaborate, learn, or grow — we're here for you.
            </p>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-1.5 gap-1">
            {(["form", "chat"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-white/10"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab === "form" ? <Send className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                {tab === "form" ? "Contact form" : "Quick chat"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="block lg:hidden space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "form" ? (
                <ContactFormSection
                  form={form}
                  onSubmit={onSubmit}
                  isLoading={isLoading}
                  serverError={serverError}
                  interests={interests}
                  roles={roles}
                  experienceLevels={experienceLevels}
                />
              ) : (
                <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-5 shadow-sm">
                  <ChatInterface />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <CommunityLinksSection />
          <ContactInfoSection />
        </div>

        {/* ── Desktop layout ── */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <CommunityLinksSection />
            <ContactInfoSection />
          </div>
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "form" ? (
                  <ContactFormSection
                    form={form}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    serverError={serverError}
                    interests={interests}
                    roles={roles}
                    experienceLevels={experienceLevels}
                  />
                ) : (
                  <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-6 shadow-sm">
                    <ChatInterface />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}

export default D4ContactForm;