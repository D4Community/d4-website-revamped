"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  Users,
  Calendar,
  MessageSquare,
  Heart,
  Sparkles,
  X,
  Loader2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  Bot,
  ArrowRight,
  MessageCircle,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  UserPlus,
  Smartphone,
  SendHorizonal,
} from "lucide-react";
import Image from "next/image";

// ===================== CONFIGURATION =====================
const COMMUNITY_LINKS = [
  {
    label: "WhatsApp Group",
    icon: <MessageCircle size={20} />,
    link: "https://chat.whatsapp.com/Khwy3LEyjdX4Kx8VJ1MXmW",
    brand: "#25D366",
  },
  {
    label: "WhatsApp Channel",
    icon: <SendHorizonal size={20} />,
    link: "https://whatsapp.com/channel/0029Va8QbTU8V0trPdleNl2I",
    brand: "#4ADE80",
  },
  {
    label: "LinkedIn",
    icon: <Linkedin size={20} />,
    link: "https://www.linkedin.com/company/d4community",
    brand: "#0077B5",
  },
  {
    label: "Github",
    icon: <Github size={20} />,
    link: "https://github.com/D4Community",
    brand: "#FFF",
  },
  {
    label: "Twitter / X",
    icon: <Twitter size={20} />,
    link: "https://twitter.com/D4community",
    brand: "#1DA1F2",
  },
  {
    label: "Instagram",
    icon: <Instagram size={20} />,
    link: "https://www.instagram.com/d4community",
    brand: "#E4405F",
  },
  {
    label: "YouTube",
    icon: <Youtube size={20} />,
    link: "https://www.youtube.com/@d4-community",
    brand: "#FF0000",
  },
  {
    label: "Commudle",
    icon: <Globe size={20} />,
    link: "https://www.commudle.com/communities/d4-community",
    brand: "#F97316",
  },
  {
    label: "Discord Server",
    icon: <Users size={20} />,
    link: "https://discord.com/invite/RPpYB8JpUQ",
    brand: "#5865F2",
  },
  {
    label: "Apply to be a Volunteer",
    icon: <UserPlus size={20} />,
    link: "https://forms.gle/CY8eDostKx2t8Wx49",
    brand: "#ec5745",
  },
];

// Banner image - you can replace this with your actual banner
const BANNER_IMAGE = "/d4community-banner.jpg"; // Place your banner in public folder

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

// ===================== SIMPLE UI COMPONENTS =====================
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`p-6 rounded-2xl border dark:border-white/10 border-gray-200 dark:bg-white/5 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/10 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`px-6 py-5 border-b dark:border-white/10 border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={`font-bold text-lg dark:text-white text-gray-900 ${className}`}>{children}</h3>
);

const CardDescription = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <p className={`text-sm dark:text-gray-300 text-gray-600 ${className}`}>{children}</p>;

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 ${className}`}>{children}</div>;

const CardFooter = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`px-6 py-5 border-t dark:border-white/10 border-gray-200 ${className}`}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-4xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-offset-white disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default:
        "bg-gradient-to-r from-[#fd7d6e] to-[#ff9a8b] text-white hover:from-[#ff9a8b] hover:to-[#fd7d6e] hover:shadow-lg hover:shadow-blue-500/20",
      outline:
        "border dark:border-white/20 border-gray-300 dark:bg-white/5 bg-white/80 dark:text-gray-300 text-gray-700 hover:dark:bg-white/10 hover:bg-gray-100 hover:dark:border-white/30 hover:border-gray-400 hover:dark:text-white hover:text-gray-900",
      ghost: "dark:bg-transparent bg-transparent dark:text-gray-300 text-gray-600 hover:dark:bg-white/5 hover:bg-gray-100 hover:dark:text-white hover:text-gray-900",
    };

    const sizes = {
      default: "h-10 px-5 py-2.5",
      sm: "h-8 rounded-4xl px-3.5 text-sm",
      lg: "h-12 rounded-4xl px-7 text-base",
    };

    const combinedClassName = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`flex h-11 w-full rounded-xl border dark:border-white/10 border-gray-300 dark:bg-white/5 bg-white/80 px-4 py-3 text-sm dark:text-white text-gray-900 dark:placeholder:text-gray-400 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`flex min-h-[100px] w-full rounded-xl border dark:border-white/10 border-gray-300 dark:bg-white/5 bg-white/80 px-4 py-3 text-sm dark:text-white text-gray-900 dark:placeholder:text-gray-400 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm ${className}`}
    {...props}
  />
));
Textarea.displayName = "Textarea";

const Label = ({
  children,
  className = "",
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none dark:text-gray-200 text-gray-700 ${className}`}
  >
    {children}
  </label>
);

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={`h-4 w-4 rounded dark:border-white/20 border-gray-300 dark:bg-white/5 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 focus:ring-offset-white ${className}`}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    children: React.ReactNode;
  }
>(({ children, className = "", ...props }, ref) => (
  <select
    ref={ref}
    className={`flex h-11 w-full rounded-xl border dark:border-white/10 border-gray-300 dark:bg-white/5 bg-white/80 px-4 py-3 text-sm dark:text-white text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm ${className}`}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

// ===================== FORM COMPONENTS =====================
const Form = ({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}) => (
  <form onSubmit={onSubmit} className="space-y-5">
    {children}
  </form>
);

const FormItem = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`space-y-3 ${className}`}>{children}</div>;

const FormLabel = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) => (
  <Label htmlFor={htmlFor} className="text-sm font-medium dark:text-gray-200 text-gray-700">
    {children}
  </Label>
);

const FormControl = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const FormMessage = ({ children }: { children?: React.ReactNode }) =>
  children ? <p className="text-sm text-red-500 dark:text-red-400">{children}</p> : null;

// ===================== CONFECTTI & LOADER =====================
function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const explode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const w = canvas.width,
      h = canvas.height;

    const pieces = Array.from({ length: 100 }).map(() => ({
      x: w / 2 + (Math.random() - 0.5) * 80,
      y: h / 2 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 1.5) * 8,
      r: 3 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      color: ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"][
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
        p.vy += 0.35; // gravity
        p.rot += 0.2;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      }
      // stop when confetti fell below screen
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
    const t = setTimeout(() => {
      onComplete?.();
    }, durationMs);
    return () => clearTimeout(t);
  }, [visible, durationMs, onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-xl pointer-events-auto"
      aria-hidden={!visible}
    >
      <style>{`
        .gc-loader {
          display: inline-flex;
          gap: 16px;
          align-items: flex-end;
          padding: 24px 32px;
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .gc-dot {
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #3b82f6;
          transform-origin: center bottom;
        }
        .gc-dot:nth-child(1) { animation: gc-bounce .8s infinite ease-in-out 0s; background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
        .gc-dot:nth-child(2) { animation: gc-bounce .8s infinite ease-in-out .15s; background: linear-gradient(135deg, #8b5cf6, #ec4899); }
        .gc-dot:nth-child(3) { animation: gc-bounce .8s infinite ease-in-out .3s; background: linear-gradient(135deg, #ec4899, #10b981); }

        @keyframes gc-bounce {
          0% { transform: translateY(0) scaleY(1); opacity: 0.7; }
          40% { transform: translateY(-20px) scaleY(1.2); opacity: 1; }
          100% { transform: translateY(0) scaleY(1); opacity: 0.7; }
        }

        @media (max-width: 420px) {
          .gc-dot { width: 12px; height: 12px; }
          .gc-loader { gap: 12px; padding: 20px 24px; border-radius: 16px; }
        }
      `}</style>

      <div className="text-center">
        <div className="gc-loader" role="status" aria-label="Loading">
          <span className="gc-dot" />
          <span className="gc-dot" />
          <span className="gc-dot" />
        </div>
        <p className="mt-6 text-lg font-medium text-white/90">
          Processing your request...
        </p>
        <p className="mt-2 text-sm text-gray-400">Welcome to D4 Community!</p>
      </div>
    </div>
  );
}

// ===================== INTERACTIVE CHAT INTERFACE =====================
interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  content: string | React.ReactNode;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      content:
        "👋 Hello there! I'm the D4 Community Assistant. I can answer questions about our community, events, and more. For detailed inquiries, I'll suggest connecting with our team.",
      timestamp: new Date(),
    },
    {
      id: "2",
      sender: "bot",
      content: "What would you like to know about D4 Community?",
      timestamp: new Date(Date.now() + 1000),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiKeyAvailable, setApiKeyAvailable] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "How to join D4 Community?",
    "Upcoming events",
    "What is D4 Community?",
    "Volunteer opportunities",
    "General questions",
  ];

  useEffect(() => {
    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    setApiKeyAvailable(!!geminiApiKey);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchGeminiResponse = async (query: string): Promise<string> => {
    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!geminiApiKey) {
      return "I'm currently in offline mode. For detailed information, please fill out the contact form and our team will get back to you! You can also check our community links for immediate joining.";
    }

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          apiKey: geminiApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return (
        data.response ||
        "Thanks for your question! For more details, please fill out the contact form below."
      );
    } catch (error) {
      console.error("Chat API error:", error);
      return "I'm having trouble connecting to my knowledge base. Please fill out the contact form for detailed inquiries or check our community links for immediate access!";
    }
  };

  const getOfflineResponse = (query: string): string => {
    const responses: Record<string, string> = {
      "How to join D4 Community?":
        "You can join D4 Community through our WhatsApp group or Discord server! Check the community links section for all joining options. We'd love to have you!",
      "Upcoming events":
        "We regularly host hackathons, workshops, and meetups in Chandigarh. Check our Commudle page or join our WhatsApp group for event announcements!",
      "What is D4 Community?":
        "D4 Community is a tech community focused on developers, designers, and tech enthusiasts. We organize events, provide learning resources, and foster collaboration!",
      "Volunteer opportunities":
        "We're always looking for volunteers! You can apply through our 'Apply to be a Volunteer' form. Check the community links section for the application.",
      "General questions":
        "I'm currently offline. For specific questions, please use the contact form below and our team will respond within 24 hours!",
    };

    const defaultResponse =
      "Thanks for your interest in D4 Community! For detailed information, please use the contact form below or check our community links.";

    return responses[query] || defaultResponse;
  };

  const handleQuickReply = async (reply: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        content: reply,
        timestamp: new Date(),
      },
    ]);

    setIsTyping(true);

    let botResponse: string;

    if (apiKeyAvailable) {
      botResponse = await fetchGeminiResponse(reply);
    } else {
      botResponse = getOfflineResponse(reply);
    }

    const finalResponse =
      botResponse +
      "\n\n💡 Pro Tip: For more detailed discussion or to connect with our team directly, please use the contact form below.";

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: finalResponse,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        content: userInput,
        timestamp: new Date(),
      },
    ]);

    setUserInput("");
    setIsTyping(true);

    let botResponse: string;

    if (apiKeyAvailable) {
      botResponse = await fetchGeminiResponse(userInput);
    } else {
      botResponse = getOfflineResponse(userInput);
    }

    const finalResponse =
      botResponse +
      "\n\n💡 **Pro Tip:** For more detailed discussion or to connect with our team directly, please use the contact form below.";

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: finalResponse,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-gradient-to-r from-[#fd7d6e] to-[#ff9a8b] rounded-xl">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold dark:text-white text-gray-900">D4 Community Assistant</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm dark:text-gray-300 text-gray-600">
                {apiKeyAvailable
                  ? "🤖 AI-Powered • Online"
                  : "📱 Offline Mode • Basic Info"}
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800/30">
                Beta
              </span>
            </div>
          </div>
        </div>

        <div className="h-80 overflow-y-auto rounded-xl dark:bg-white/5 bg-gray-50/80 border dark:border-white/10 border-gray-200 p-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none shadow-lg shadow-blue-900/20"
                    : "dark:bg-gradient-to-r dark:from-white/5 dark:to-white/10 bg-gradient-to-r from-gray-50 to-white border dark:border-white/10 border-gray-200 rounded-bl-none"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {msg.sender === "bot" && (
                    <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  )}
                  <div className="text-sm whitespace-pre-wrap leading-relaxed dark:text-gray-100 text-gray-800">
                    {msg.content}
                  </div>
                </div>
                <div
                  className={`text-xs mt-2 ${msg.sender === "user" ? "text-blue-200/70" : "dark:text-gray-400 text-gray-500"}`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="p-2 dark:bg-white/5 bg-gray-50 rounded-xl border dark:border-white/10 border-gray-200">
                <Bot className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-bounce" />
                <div
                  className="h-2.5 w-2.5 bg-[#fd7d6e] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="h-2.5 w-2.5 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {quickReplies.map((reply) => (
            <Button
              key={reply}
              variant="outline"
              size="sm"
              className="rounded-full hover:scale-[1.02] transition-all duration-300"
              onClick={() => handleQuickReply(reply)}
            >
              {reply}
            </Button>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <Input
            placeholder="Ask me about D4 Community..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-[#fd7d6e] to-[#ff9a8b] hover:shadow-lg hover:shadow-blue-500/20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {!apiKeyAvailable && (
          <div className="mt-3 p-3 rounded-xl dark:bg-white/5 bg-gray-50/80 border dark:border-white/10 border-gray-200">
            <p className="text-xs text-center dark:text-gray-300 text-gray-600">
              💡 <span className="text-blue-400">Tip:</span> Add Gemini API key
              for AI-powered responses
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

// ===================== SUCCESS MODAL =====================
const SuccessModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
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
      <canvas
        ref={canvasRef as React.RefObject<HTMLCanvasElement>}
        className="pointer-events-none fixed inset-0 z-[1200] w-full h-full"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl rounded-2xl dark:bg-white/5 bg-white/90 backdrop-blur-xl p-6 shadow-2xl shadow-black/40 border dark:border-white/10 border-gray-200"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:dark:bg-white/10 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-4 w-4 dark:text-gray-300 text-gray-600" />
          </button>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-44 h-44 rounded-2xl bg-gradient-to-r from-[#fd7d6e] to-[#ff9a8b] flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <div className="w-28 h-28 rounded-xl dark:bg-black/40 bg-white/20 flex items-center justify-center shadow-inner">
                <svg viewBox="0 0 120 120" className="w-20 h-20">
                  <defs>
                    <linearGradient id="g2" x1="0" x2="1">
                      <stop offset="0" stopColor="#3b82f6" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="48" fill="url(#g2)" />
                  <path
                    d="M40 62 L54 76 L82 44"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 200,
                      strokeDashoffset: 200,
                      animation: "dash 0.7s forwards 0.15s",
                    }}
                  />
                  <style>{`
                    @keyframes dash { to { stroke-dashoffset: 0; } }
                    @keyframes pulse-s { 0%{ transform: scale(1);} 50%{ transform: scale(1.03);} 100%{ transform: scale(1);} }
                    svg { animation: pulse-s 3s ease-in-out infinite; transform-origin: center; }
                  `}</style>
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold dark:text-white text-gray-900">
                    Thanks — you're awesome!
                  </h3>
                  <p className="mt-2 text-sm dark:text-gray-300 text-gray-600 max-w-md">
                    We received your application and will get back to you soon.
                    Meanwhile, join our community links below!
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div>
                  <p className="font-medium dark:text-white text-gray-900">D4 Community</p>
                  <p className="text-xs dark:text-gray-300 text-gray-600 mt-1">
                    Expect an email reply within 24 hours.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={COMMUNITY_LINKS[0].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-xl px-3.5 py-2 text-sm font-medium bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 border border-blue-800/30 transition-colors"
                    >
                      Join WhatsApp Group
                    </a>
                    <a
                      href="mailto:help.d4community@gmail.com"
                      className="inline-flex items-center rounded-xl px-3.5 py-2 text-sm font-medium dark:bg-white/5 dark:text-gray-300 bg-gray-100 text-gray-700 hover:dark:bg-white/10 hover:bg-gray-200 border dark:border-white/10 border-gray-300 transition-colors"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={onClose}
                  className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium dark:bg-white/5 dark:text-gray-300 bg-gray-100 text-gray-700 hover:dark:bg-white/10 hover:bg-gray-200 border dark:border-white/10 border-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center text-xs dark:text-gray-400 text-gray-500">
            <span>D4 Community — thanks for connecting!</span>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

// ===================== MAIN CONTACT FORM =====================
export function D4ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "chat">("form");
  const [serverError, setServerError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      interest: [],
      experience: "",
      subject: "",
      other: "",
      message: "",
      agreeToTerms: false,
    },
  });

  const interests = [
    "Web Development",
    "Mobile Development",
    "AI/ML",
    "Cloud Computing",
    "DevOps",
    "UI/UX Design",
    "Open Source",
    "Startups",
    "Mentoring",
    "Hackathons",
    "Other",
  ];

  const roles = [
    "Student",
    "Professional Developer",
    "Beginner",
    "Freelancer",
    "Entrepreneur",
    "Researcher",
    "Designer",
    "Other",
  ];

  const experienceLevels = [
    "Beginner (0-1 years)",
    "Intermediate (1-3 years)",
    "Advanced (3-5 years)",
    "Expert (5+ years)",
  ];

  const onLoaderComplete = () => {
    setShowLoader(false);
    setIsLoading(false);

    if (serverError) {
      return;
    }

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

      // Success handled by DotsLoader onComplete
    } catch (err: any) {
      console.error(err);
      setServerError(err?.message || "Something went wrong. Please try again.");
      setShowLoader(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 mt-16">
      {/* Dots loader overlay */}
      <DotsLoader
        visible={showLoader}
        durationMs={1800}
        onComplete={onLoaderComplete}
      />

      {/* Header with Banner */}
      <div className="max-w-7xl mx-auto">
        {/* Banner Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-black/30"
        >
          {/* Banner Image Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-white/10 z-10" />
            {/* You can replace this with an actual Image component if you have a banner */}
            <div className="w-full h-full bg-gradient-to-r from-[#fd7d6e] to-[#ff9a8b] to-white/10" />
            {/* D4 Community text overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center px-4">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 mb-4">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">
                    D4 Community
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            {/* You can add a banner image here */}
            {/* <Image
              src={BANNER_IMAGE}
              alt="D4 Community Banner"
              fill
              className="object-cover opacity-30"
              priority
            /> */}
          </div>
        </motion.div>

        <div className="mx-auto max-w-6xl px-6 mb-16 text-center">
          <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-gray-900 tracking-tight">
            Let's Build{" "}
            <span className="dark:text-gray-300 text-gray-700">
              {"Together".split("").map((word, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h2>
          <p className="dark:text-gray-300 text-gray-600 mt-4 text-sm tracking-wide text-balance md:text-base text-center">
            Connect with our community of developers, designers, and tech
            enthusiasts. Whether you're looking to collaborate, learn, or
            grow, we're here for you
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-4xl dark:bg-white/5 bg-white/80 backdrop-blur-sm p-1.5 border dark:border-white/10 border-gray-200">
              <Button
                variant={activeTab === "form" ? "default" : "ghost"}
                className={`rounded-4xl ${activeTab === "form" ? "shadow-lg shadow-blue-500/10" : ""}`}
                onClick={() => setActiveTab("form")}
              >
                <Send className="mr-2 h-4 w-4" />
                Contact Form
              </Button>
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                className={`rounded-4xl ${activeTab === "chat" ? "shadow-lg shadow-purple-500/10" : ""}`}
                onClick={() => setActiveTab("chat")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Quick Chat
              </Button>
            </div>
          </div>

          {/* Mobile: Form first, then links */}
          <div className="block lg:hidden space-y-6">
            {/* Form/Chat Section (First on mobile) */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === "form" ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ContactFormSection
                      form={form}
                      onSubmit={onSubmit}
                      isLoading={isLoading}
                      serverError={serverError}
                      interests={interests}
                      roles={roles}
                      experienceLevels={experienceLevels}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ChatInterface />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Links Section (Second on mobile) */}
            <div className="space-y-6">
              <CommunityLinksSection />
              <ContactInfoSection />
            </div>
          </div>

          {/* Desktop: Original layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {/* Left Column - Contact Info */}
            <div className="space-y-6">
              <CommunityLinksSection />
              <ContactInfoSection />
            </div>

            {/* Right Column - Form/Chat */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {activeTab === "form" ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ContactFormSection
                      form={form}
                      onSubmit={onSubmit}
                      isLoading={isLoading}
                      serverError={serverError}
                      interests={interests}
                      roles={roles}
                      experienceLevels={experienceLevels}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ChatInterface />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}

// ===================== COMPONENT SECTIONS =====================

const CommunityLinksSection = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 dark:text-white text-gray-900">
        <Users className="h-5 w-5 text-blue-400" />
        Community Links
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {COMMUNITY_LINKS.map((item) => (
        <a
          key={item.label}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl dark:bg-white/5 bg-gray-50/80 hover:dark:bg-white/10 hover:bg-gray-100 border dark:border-white/10 border-gray-200 hover:dark:border-white/20 hover:border-gray-300 transition-all duration-300 group hover:scale-[1.02]"
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg dark:bg-white/5 bg-gray-100 group-hover:dark:bg-white/10 group-hover:bg-gray-200 transition-colors"
              style={{ color: item.brand }}
            >
              {item.icon}
            </div>
            <span className="font-medium dark:text-gray-200 text-gray-700 group-hover:dark:text-white group-hover:text-gray-900 transition-colors">
              {item.label}
            </span>
          </div>
          <ExternalLink className="h-4 w-4 dark:text-gray-400 text-gray-500 group-hover:dark:text-gray-300 group-hover:text-gray-700 transition-colors" />
        </a>
      ))}
    </CardContent>
  </Card>
);

const ContactInfoSection = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 dark:text-white text-gray-900">
        <Calendar className="h-5 w-5 text-purple-400" />
        Quick Info
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-xl dark:bg-white/5 bg-gray-50/80 border dark:border-white/10 border-gray-200">
        <div className="p-2 rounded-lg bg-blue-900/20">
          <Mail className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm dark:text-gray-300 text-gray-600">Email</p>
          <a
            href="mailto:help.d4community@gmail.com"
            className="font-medium dark:text-gray-200 text-gray-700 hover:text-blue-400 transition-colors"
          >
            help.d4community@gmail.com
          </a>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ContactFormSection = ({
  form,
  onSubmit,
  isLoading,
  serverError,
  interests,
  roles,
  experienceLevels,
}: any) => (
  <Card className="shadow-2xl shadow-black/20">
    <CardHeader className="bg-gradient-to-r from-blue-900/10 to-purple-900/10">
      <CardTitle className="dark:text-white text-gray-900">Join D4 Community</CardTitle>
      <CardDescription>
        Tell us about yourself and how you'd like to be involved
      </CardDescription>
    </CardHeader>

    <form onSubmit={form.handleSubmit(onSubmit)}>
      <CardContent className="space-y-6 pt-6">
        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-5">
          <FormItem>
            <FormLabel htmlFor="name">Full Name *</FormLabel>
            <Input
              id="name"
              placeholder="Iti"
              value={form.watch("name")}
              onChange={(e) => form.setValue("name", e.target.value)}
            />
            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="email">Email *</FormLabel>
            <Input
              id="email"
              placeholder="iti@example.com"
              value={form.watch("email")}
              onChange={(e) => form.setValue("email", e.target.value)}
            />
            <FormMessage>{form.formState.errors.email?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="phone">Phone Number *</FormLabel>
            <Input
              id="phone"
              placeholder="+91 98765 43210"
              value={form.watch("phone")}
              onChange={(e) => form.setValue("phone", e.target.value)}
            />
            <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="role">Your Role *</FormLabel>
            <Select
              id="role"
              value={form.watch("role")}
              onChange={(e) => form.setValue("role", e.target.value)}
            >
              <option value="" className="dark:bg-gray-900 bg-white">
                Select your role
              </option>
              {roles.map((role: string) => (
                <option key={role} value={role} className="dark:bg-gray-900 bg-white">
                  {role}
                </option>
              ))}
            </Select>
            <FormMessage>{form.formState.errors.role?.message}</FormMessage>
          </FormItem>
        </div>

        {/* Subject and Other fields */}
        <div className="grid md:grid-cols-2 gap-5">
          <FormItem>
            <FormLabel htmlFor="subject">Subject (Optional)</FormLabel>
            <Input
              id="subject"
              placeholder="e.g., Collaboration Proposal"
              value={form.watch("subject")}
              onChange={(e) => form.setValue("subject", e.target.value)}
            />
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="other">Other (Optional)</FormLabel>
            <Input
              id="other"
              placeholder="Any other information"
              value={form.watch("other")}
              onChange={(e) => form.setValue("other", e.target.value)}
            />
          </FormItem>
        </div>

        {/* Interests */}
        <FormItem>
          <FormLabel>Areas of Interest *</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interests.map((item: string) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={item}
                  checked={form.watch("interest")?.includes(item)}
                  onChange={(e) => {
                    const updatedValue = e.target.checked
                      ? [...(form.watch("interest") || []), item]
                      : form
                          .watch("interest")
                          ?.filter((value: string) => value !== item);
                    form.setValue("interest", updatedValue || []);
                  }}
                />
                <Label
                  htmlFor={item}
                  className="text-sm dark:text-gray-200 text-gray-700 cursor-pointer hover:dark:text-white hover:text-gray-900 transition-colors"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
          <FormMessage>{form.formState.errors.interest?.message}</FormMessage>
        </FormItem>

        {/* Experience */}
        <FormItem>
          <FormLabel htmlFor="experience">Experience Level *</FormLabel>
          <Select
            id="experience"
            value={form.watch("experience")}
            onChange={(e) => form.setValue("experience", e.target.value)}
          >
            <option value="" className="dark:bg-gray-900 bg-white">
              Select experience level
            </option>
            {experienceLevels.map((level: string) => (
              <option key={level} value={level} className="dark:bg-gray-900 bg-white">
                {level}
              </option>
            ))}
          </Select>
          <FormMessage>{form.formState.errors.experience?.message}</FormMessage>
        </FormItem>

        {/* Message */}
        <FormItem>
          <FormLabel htmlFor="message">Your Message *</FormLabel>
          <Textarea
            id="message"
            placeholder="Tell us why you want to join D4 Community, what projects you're working on, or any questions you have..."
            className="min-h-[140px]"
            value={form.watch("message")}
            onChange={(e) => form.setValue("message", e.target.value)}
          />
          <FormMessage>{form.formState.errors.message?.message}</FormMessage>
        </FormItem>

        {/* Terms */}
        <div className="flex items-start space-x-3 space-y-0 rounded-xl border dark:border-white/10 border-gray-200 p-4 dark:bg-white/5 bg-gray-50/80">
          <Checkbox
            id="agreeToTerms"
            checked={form.watch("agreeToTerms")}
            onChange={(e) => form.setValue("agreeToTerms", e.target.checked)}
          />
          <div className="space-y-2 leading-none">
            <Label htmlFor="agreeToTerms" className="dark:text-gray-200 text-gray-700">
              I agree to the terms and conditions
            </Label>
            <p className="text-sm dark:text-gray-300 text-gray-600">
              By submitting this form, you agree to receive communications from
              D4 Community about events, opportunities, and community updates.
            </p>
            <FormMessage>
              {form.formState.errors.agreeToTerms?.message}
            </FormMessage>
          </div>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="rounded-xl border border-red-900/30 bg-red-900/10 px-4 py-3 text-sm text-red-500 dark:text-red-400">
            {serverError}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#fd7d6e] to-[#ff9a8b] hover:from-[#ff9a8b] hover:to-[#fd7d6e] hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Application
            </>
          )}
        </Button>

        <div className="text-center text-sm dark:text-gray-300 text-gray-600">
          <p>We typically respond within 24 hours</p>
        </div>
      </CardFooter>
    </form>
  </Card>
);

export default D4ContactForm;