"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MapCanvasProps } from "./globe-map";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// --- Interfaces ---
interface Location {
  lat: number;
  lng: number;
  city: string;
  country: string;
  name: string;
  role?: string;
  topic?: string;
  org?: string;
  state?: string;
  date?: string;
  attendees?: string;
  type: string;
  id: string;
}

interface CityGroup {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  items: Location[];
}

interface AnchorPos {
  x: number;
  y: number;
}

const mapData = {
  speakers: [
    {
      // FIX: was Warsaw coordinates (52.2297, 21.0122) while city is Katowice
      lat: 50.2649,
      lng: 19.0238,
      city: "Katowice",
      country: "Poland",
      name: "Kasia Biernat-Kluba",
      role: "Principal Software Engineer",
      topic: "Beyond the Browser: Angular Meets Generative AI",
    },
    {
      lat: 40.4168,
      lng: -3.7038,
      city: "Madrid",
      country: "Spain",
      name: "Victoria Clotet",
      role: "Founder & CEO of Influsfera",
      topic: "AI as Your CTO Co‑Founder: Build Smarter, Not Harder",
    },
    {
      lat: 50.2649,
      lng: 19.0238,
      city: "Katowice",
      country: "Poland",
      name: "Brygida Fiejdasz",
      role: "Senior Frontend Developer @ Avenga",
      topic:
        "Console.log is Not a Strategy - Mastering AI and Hidden DevTools Gems",
    },
    {
      lat: 28.5355,
      lng: 77.391,
      city: "Noida",
      country: "India",
      name: "Pranav Kumar Verma",
      role: "Technical Lead at Wipro",
      topic: "Project IDX",
    },
    {
      lat: 28.6139,
      lng: 77.209,
      city: "Delhi",
      country: "India",
      name: "Dhruv Kumar",
      role: "Software Engineer",
      topic: "Kubernetes at Scale",
    },
    {
      lat: 28.6139,
      lng: 77.209,
      city: "Delhi",
      country: "India",
      name: "Chhavi Garg",
      role: "Founder & CEO of BharatXR",
      topic: "Build With AR",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      country: "India",
      name: "Simar Preet Singh",
      role: "Frontend Developer",
      topic: "Building SaaS Products",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      country: "India",
      name: "Pranav Singh Parmar",
      role: "IOS & Mobile Developer",
      topic: "AI in Flutter Apps",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      country: "India",
      name: "Veer Pratap Singh",
      role: "Lead Software Engineer",
      topic: "Full-Stack Development",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      country: "India",
      name: "Udayveer Singh",
      role: "WEB3 Developer",
      topic: "WEB3 Development",
    },
    {
      lat: 31.254,
      lng: 75.7053,
      city: "Jalandhar",
      country: "India",
      name: "Amanpreet Kaur",
      role: "Android Developer",
      topic: "Mobile Development",
    },
    {
      lat: 30.901,
      lng: 75.8573,
      city: "Ludhiana",
      country: "India",
      name: "Gaurav Madaan",
      role: "Co-Founder & CTO at NIWI.AI",
      topic: "Generative AI",
    },
    {
      lat: 31.254,
      lng: 75.7053,
      city: "Jalandhar",
      country: "India",
      name: "Loveleen Kaur",
      role: "Android Developer",
      topic: "Introduction to Android Development",
    },
    {
      lat: 17.385,
      lng: 78.4867,
      city: "Hyderabad",
      country: "India",
      name: "Jaskeerat Singh",
      role: "Software Engineer",
      topic: "Getting Started With GenAI",
    },
    {
      lat: 12.9716,
      lng: 77.5946,
      city: "Bangalore",
      country: "India",
      name: "Shantam Sultania",
      role: "Director, Morgan Stanley India",
      topic: "GenAI Applications with Specs & AI",
    },
    {
      lat: 12.9716,
      lng: 77.5946,
      city: "Bangalore",
      country: "India",
      name: "Harsh Badwaik",
      role: "Software Engineer at Mercari",
      topic: "Multi-Agent Systems with AIpex",
    },
    {
      lat: 12.9716,
      lng: 77.5946,
      city: "Bangalore",
      country: "India",
      name: "Aditya Thakur",
      role: "Software Engineer at Scapia | Google Developer Expert",
      topic: "Cross-platform AI Experiences with Flutter & Dart",
    },
    {
      lat: 12.9716,
      lng: 77.5946,
      city: "Bangalore",
      country: "India",
      name: "Darshan Madhu",
      role: "Technical Product Manager (AI) at Mercari",
      topic: "From Prompts to Products: Turning LLMs into Real-World Tools",
    },
    {
      lat: 12.9716,
      lng: 77.5946,
      city: "Bangalore",
      country: "India",
      name: "Nishtha Saraswat",
      role: "SDE",
      topic: "Opening Keynote Speaker",
    },
    {
      lat: 28.4595,
      lng: 77.0266,
      city: "Gurugram",
      country: "India",
      name: "Ashwani Kumar",
      role: "CTI Analyst",
      topic: "Cybersecurity in the Age of AI",
    },
    {
      lat: 12.9716,
      lng: 77.5946,
      city: "Bangalore",
      country: "India",
      name: "Aditya Joshi",
      role: "Senior Software Engineer at Walmart | Google Developer Expert",
      topic: "From Prompt to Autonomous: Building AI Agents with Google ADK",
    },
    {
      lat: 18.5204,
      lng: 73.8567,
      city: "Pune",
      country: "India",
      name: "Saurabh Mishra",
      role: "Google Developer Expert - Cloud",
      topic: "Agentic Run: From Build to Autonomous",
    },
    {
      lat: 30.7046,
      lng: 76.7179,
      city: "Mohali",
      country: "India",
      name: "Sarabjeet Singh",
      role: "Lead Experience Engineer at Publicis Sapient",
      topic:
        "Beyond the Prompt: Building Production-Ready Applications with Generative AI",
    },
    {
      lat: 30.7046,
      lng: 76.7179,
      city: "Mohali",
      country: "India",
      name: "Raveen Singh",
      role: "Assistant Manager at Plaksha University",
      topic: "Re-Imagining Tech Education in an AI Driven World",
    },
    {
      lat: 26.922070,
      lng: 75.778885,
      city: "Jaipur",
      country: "India",
      name: "Harshit Parwal",
      role: "Senior Software Engineer at LTM",
      topic: "From Cron to Cognitive: Governing Autonomous AI in the Wild",
    },
    {
      lat: 18.5204,
      lng: 73.8567,
      city: "Pune",
      country: "India",
      name: "Jitendra Gupta",
      role: "Enterprise Architect - AIOps & Platform Engineering at EPAM Systems | Google Developer Expert - Google Cloud",
      topic: "MCP: The USB-C of AI - Connecting AI Agents to the Real World",
    },
  ],
  leads: [
    {
      lat: 30.6869,
      lng: 76.6813,
      city: "Chandigarh",
      country: "India",
      name: "Bhumika Varshney",
      role: "Campus Lead",
      org: "CGC University",
    },
    {
      lat: 30.771,
      lng: 76.579,
      city: "Chandigarh",
      country: "India",
      name: "Pawan",
      role: "Campus Lead",
      org: "Chandigarh University",
    },
    {
      lat: 30.7046,
      lng: 76.6596,
      city: "Chandigarh",
      country: "India",
      name: "Ishita",
      role: "Campus Lead",
      org: "CGC Landran",
    },
    {
      lat: 31.255,
      lng: 75.705,
      city: "Jalandhar",
      country: "India",
      name: "Gagandeep Singh",
      role: "Campus Lead",
      org: "Lovely Professional University",
    },
    {
      lat: 12.9716,
      lng: 77.5946,
      city: "Bangalore",
      country: "India",
      name: "Alliance University",
      role: "University Partner",
      org: "Alliance University",
    },
    {
      lat: 12.9344,
      lng: 77.6097,
      city: "Bangalore",
      country: "India",
      name: "Haziq",
      role: "Campus Lead",
      org: "NMIT Bangalore",
    },
  ],
  events: [
    {
      lat: 12.9352,
      lng: 77.6245,
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      name: "GenAI Conclave 2025, Bangalore",
      date: "Nov 29, 2025",
      attendees: "70+",
    },
    {
      lat: 30.901,
      lng: 75.8573,
      city: "Ludhiana",
      state: "Punjab",
      country: "India",
      name: "GenAI Conclave 2025, Ludhiana",
      date: "Sep 06, 2025",
      attendees: "100+",
    },
    {
      lat: 31.326,
      lng: 75.5762,
      city: "Jalandhar",
      state: "Punjab",
      country: "India",
      name: "GenAI Conclave 2025, Jalandhar",
      date: "Dec 06, 2025",
      attendees: "250+",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      state: "Chandigarh",
      country: "India",
      name: "GenAI Conclave 2024, Chandigarh",
      date: "July 2024",
      attendees: "250+",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      state: "Chandigarh",
      country: "India",
      name: "GDG TechShow Chandigarh",
      date: "Feb 18, 2023",
      attendees: "300+",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      state: "Chandigarh",
      country: "India",
      name: "InnoSprint",
      date: "Oct 6-7, 2024",
      attendees: "400+",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      state: "Chandigarh",
      country: "India",
      name: "Hack-N-Win",
      date: "Mar 2-3, 2024",
      attendees: "500+",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      state: "Chandigarh",
      country: "India",
      name: "Hack-N-Win 2.0",
      date: "Mar 1-2, 2024",
      attendees: "700+",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      state: "Chandigarh",
      country: "India",
      name: "Hack-N-Win 3.0",
      date: "Mar 7-9, 2024",
      attendees: "1700+",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      state: "Chandigarh",
      country: "India",
      name: "Zero to Agent:Mohali (w/D4 Community)",
      date: "Apr 24, 2026",
      attendees: "100+",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      state: "Chandigarh",
      country: "India",
      name: "GenAI Conclave 2026, Chandigarh",
      date: "Oct 03, 2026",
      attendees: "150+",
    },
  ],
};

type FilterType = "all" | "speakers" | "leads" | "events";
type ViewMode = "map" | "globe";

// ─── Pure helpers (module level) ─────────────────────────────────────────────
function calcPopupPos(
  anchorX: number,
  anchorY: number,
  containerW: number,
  containerH: number,
  popupW: number,
  popupH: number,
) {
  const margin = 10;
  const gap = 15;
  const above = anchorY - gap >= popupH + margin;
  const top = above ? anchorY - gap - popupH : anchorY + gap;
  let left = anchorX - popupW / 2;
  left = Math.max(margin, Math.min(left, containerW - popupW - margin));
  const arrowLeft = anchorX - left;
  return { left, top, above, arrowLeft };
}

function getRegionKey(g: CityGroup): string {
  if (g.country !== "India") return g.country;
  const state = g.items[0].state;
  return state ? `${state}, India` : `${g.city}, India`;
}

// Region label -> country name used by the world atlas (exact match, no substring)
function regionToCountry(region: string | null): string | null {
  if (!region) return null;
  return region.endsWith(", India") ? "India" : region;
}

const typeBadge = (type: string) => {
  if (type === "speaker")
    return { bg: "bg-blue-500/20", text: "text-blue-400", label: "Speaker" };
  if (type === "lead")
    return {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      label: "Lead",
    };
  return { bg: "bg-amber-500/20", text: "text-amber-400", label: "Event" };
};

const typeAccent = (type: string) => {
  if (type === "speaker")
    return {
      card: "bg-blue-500/5 border-blue-500/20",
      accent: "text-blue-400",
    };
  if (type === "lead")
    return {
      card: "bg-emerald-500/5 border-emerald-500/20",
      accent: "text-emerald-400",
    };
  return {
    card: "bg-amber-500/5 border-amber-500/20",
    accent: "text-amber-400",
  };
};

function readDarkMode() {
  return (
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function subscribeToDarkMode(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => {
    mq.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

function useDarkMode() {
  return useSyncExternalStore(subscribeToDarkMode, readDarkMode, () => false);
}

function useMapTheme(isDark: boolean) {
  return useMemo(
    () => ({
      landFill: isDark ? "#1c1c1e" : "#e8e8e8",
      countryStroke: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
      countryStrokeWidth: isDark ? 0.6 : 0.5,
      oceanFill: isDark ? "#0a0a0a" : "#dde8f0",
      containerBg: isDark ? "#080808" : "#dde8f0",
      sphereStroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
      hoverFill: isDark ? "#2a2a2e" : "rgba(59,130,246,0.1)",
      markerStroke: isDark ? "#0a0a0a" : "#ffffff",
    }),
    [isDark],
  );
}

const GLOBE_MIN_SCALE = 150;
const GLOBE_MAX_SCALE = 650;
const MAP_BASE_SCALE = 160;
const MAP_MIN_ZOOM = 1;
const MAP_MAX_ZOOM = 8;

// ─── Components defined at MODULE level (never inside render) ────────────────
// FIX: these used to be declared inside the component / popup IIFE, so React
// saw a brand new component type on every render and remounted them (which is
// what swallowed zoom-button clicks while the globe was rotating).
function ZoomControls({
  onIn,
  onOut,
  disabledIn,
  disabledOut,
}: {
  onIn: () => void;
  onOut: () => void;
  disabledIn: boolean;
  disabledOut: boolean;
}) {
  return (
    <div className="absolute bottom-6 right-6 z-40 flex flex-col overflow-hidden rounded-xl border border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-black/85 shadow-xl">
      <button
        onClick={onIn}
        disabled={disabledIn}
        className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-20 font-mono text-xl"
      >
        +
      </button>
      <div className="h-px bg-neutral-200 dark:bg-white/10" />
      <button
        onClick={onOut}
        disabled={disabledOut}
        className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-20 font-mono text-xl"
      >
        −
      </button>
    </div>
  );
}

function PopupDetail({
  item,
  isMobile = false,
}: {
  item: Location;
  isMobile?: boolean;
}) {
  const badge = typeBadge(item.type);
  const accent = typeAccent(item.type);
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
      className={isMobile ? "p-6 space-y-5" : "p-4 space-y-3"}
    >
      <div>
        <span
          className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase inline-block mb-1.5 ${badge.bg} ${badge.text}`}
        >
          {badge.label}
        </span>
        <h4
          className={`${isMobile ? "text-xl" : "text-[14px]"} font-bold text-neutral-900 dark:text-white leading-tight`}
        >
          {item.name}
        </h4>
        {item.role && (
          <p
            className={`${isMobile ? "text-sm" : "text-[11px]"} text-neutral-500 dark:text-neutral-400 mt-1`}
          >
            {item.role}
          </p>
        )}
      </div>
      {item.topic && (
        <div
          className={`rounded-xl ${isMobile ? "p-4" : "p-3"} border ${accent.card}`}
        >
          <p className="text-[9px] text-neutral-400 font-bold uppercase mb-1 tracking-wider">
            Topic
          </p>
          <p
            className={`${isMobile ? "text-sm" : "text-[11px]"} text-neutral-800 dark:text-neutral-200 leading-relaxed italic`}
          >
            {`"${item.topic}"`}
          </p>
        </div>
      )}
      {item.org && (
        <div
          className={`rounded-xl ${isMobile ? "p-4" : "p-3"} border ${accent.card}`}
        >
          <p className="text-[9px] text-neutral-400 font-bold uppercase mb-1 tracking-wider">
            Organization
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            <span
              className={`${isMobile ? "text-sm" : "text-[12px]"} font-bold text-neutral-900 dark:text-neutral-100`}
            >
              {item.org}
            </span>
          </div>
        </div>
      )}
      {item.type === "event" && (
        <div className="grid grid-cols-2 gap-2">
          <div
            className={`rounded-xl ${isMobile ? "p-3" : "p-2.5"} border ${accent.card}`}
          >
            <p className="text-[9px] text-neutral-400 font-bold uppercase mb-0.5 tracking-wider">
              Date
            </p>
            <p
              className={`${isMobile ? "text-sm" : "text-[11px]"} font-bold ${accent.accent}`}
            >
              {item.date}
            </p>
          </div>
          <div
            className={`rounded-xl ${isMobile ? "p-3" : "p-2.5"} border ${accent.card}`}
          >
            <p className="text-[9px] text-neutral-400 font-bold uppercase mb-0.5 tracking-wider">
              Reach
            </p>
            <p
              className={`${isMobile ? "text-sm" : "text-[11px]"} font-bold ${accent.accent}`}
            >
              {item.attendees}
            </p>
          </div>
        </div>
      )}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <span className="text-[9px] text-neutral-400">
          {item.city}, {item.country}
        </span>
        <span className="text-[9px] text-neutral-400 font-mono">
          {item.lat.toFixed(2)}°, {item.lng.toFixed(2)}°
        </span>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("globe");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [position, setPosition] = useState({
    coordinates: [0, 0] as [number, number],
    zoom: 1,
  });
  const [globeScale, setGlobeScale] = useState(210);
  const [rotation, setRotation] = useState<[number, number, number]>([
    -78, -20, 0,
  ]);
  const [popup, setPopup] = useState<{
    group: CityGroup;
    anchor: AnchorPos;
    activeIdx: number;
  } | null>(null);

  const [geoData, setGeoData] = useState<object | null>(null);
  const [MapView, setMapView] = useState<React.ComponentType<MapCanvasProps> | null>(null);

  const isDark = useDarkMode();
  const theme = useMapTheme(isDark);
  const {
    landFill,
    countryStroke,
    countryStrokeWidth,
    oceanFill,
    containerBg,
    sphereStroke,
    hoverFill,
    markerStroke,
  } = theme;

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const isDraggingGlobe = useRef(false);
  const downPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const rotationRef = useRef<[number, number, number]>([-78, -20, 0]);
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPinchDistance = useRef<number | null>(null);
  const pinchingRef = useRef(false);
  const dragRafRef = useRef<number | null>(null);
  const viewModeRef = useRef<ViewMode>(viewMode);

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;
    let dead = false;
    const ctrl = new AbortController();
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || dead) return;
        io.disconnect();
        import("./globe-map").then((m) => {
          if (!dead) setMapView(() => m.MapCanvas);
        });
        fetch(geoUrl, { signal: ctrl.signal })
          .then((r) => r.json())
          .then((data) => {
            if (!dead) setGeoData(data);
          })
          .catch(() => {
            /* ignore (aborted / offline) */
          });
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => {
      dead = true;
      ctrl.abort();
      io.disconnect();
    };
  }, []);

  // ─── Data Logic ───
  const cityGroups = useMemo(() => {
    const rawList: Location[] = [];
    if (filter === "all" || filter === "speakers")
      mapData.speakers.forEach((s, i) =>
        rawList.push({ ...s, type: "speaker", id: `sp-${i}` }),
      );
    if (filter === "all" || filter === "leads")
      mapData.leads.forEach((l, i) =>
        rawList.push({ ...l, type: "lead", id: `ld-${i}` }),
      );
    if (filter === "all" || filter === "events")
      mapData.events.forEach((e, i) =>
        rawList.push({ ...e, type: "event", id: `ev-${i}` }),
      );

    const map = new Map<string, CityGroup>();
    rawList.forEach((item) => {
      const key = `${item.city.trim().toLowerCase()}||${item.country.trim().toLowerCase()}`;
      if (!map.has(key))
        map.set(key, {
          id: key,
          city: item.city,
          country: item.country,
          lat: item.lat,
          lng: item.lng,
          items: [],
        });
      const g = map.get(key)!;
      g.items.push(item);
      g.lat = g.items.reduce((s, l) => s + l.lat, 0) / g.items.length;
      g.lng = g.items.reduce((s, l) => s + l.lng, 0) / g.items.length;
    });
    return Array.from(map.values());
  }, [filter]);

  const regionOptions = useMemo(() => {
    const set = new Set<string>();
    cityGroups.forEach((g) => set.add(getRegionKey(g)));
    return Array.from(set).sort();
  }, [cityGroups]);

  const filteredGroups = useMemo(() => {
    if (!selectedRegion) return cityGroups;
    return cityGroups.filter((g) => getRegionKey(g) === selectedRegion);
  }, [cityGroups, selectedRegion]);

  const selectedCountry = useMemo(
    () => regionToCountry(selectedRegion),
    [selectedRegion],
  );

  // ─── Hide-timer helpers (stable) ───
  const clearHide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(
    (ms = 250) => {
      if (typeof window === "undefined" || window.innerWidth < 768) return;
      clearHide();
      hideTimerRef.current = setTimeout(() => setPopup(null), ms);
    },
    [clearHide],
  );

  useEffect(() => {
    return () => {
      clearHide();
      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
    };
  }, [clearHide]);

  // ─── Frame-rate independent auto-rotate & momentum loop ───
  // React state is only updated at ~30fps. The loop does not run while the
  // globe is off screen or the tab is hidden.
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const sinceRenderRef = useRef<number>(0);
  const onScreenRef = useRef(false);

  const stopAutoRotate = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startAutoRotate = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = performance.now();
    sinceRenderRef.current = 0;

    const tick = (now: number) => {
      if (document.hidden || !onScreenRef.current) {
        rafRef.current = null;
        return;
      }

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (!isDraggingGlobe.current) {
        const f = dt * 60; // normalise to "frames at 60fps"
        let changed = false;
        const v = velocityRef.current;

        if (Math.abs(v.x) > 0.01 || Math.abs(v.y) > 0.01) {
          rotationRef.current = [
            rotationRef.current[0] + v.x * f,
            Math.max(-80, Math.min(80, rotationRef.current[1] - v.y * f)),
            0,
          ];
          const damp = Math.pow(0.92, f);
          v.x *= damp;
          v.y *= damp;
          changed = true;
        } else {
          // auto spin (stops by itself while a popup is open, see effect below)
          rotationRef.current = [
            rotationRef.current[0] + 12 * dt,
            rotationRef.current[1],
            0,
          ];
          changed = true;
        }

        if (changed) {
          sinceRenderRef.current += dt;
          if (sinceRenderRef.current >= 1 / 30) {
            sinceRenderRef.current = 0;
            setRotation([rotationRef.current[0], rotationRef.current[1], 0]);
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const el = mapContainerRef.current;
    const spinning =
      viewMode === "globe" && !selectedRegion && !popup;

    const sync = () => {
      if (spinning && onScreenRef.current && !document.hidden) startAutoRotate();
      else stopAutoRotate();
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreenRef.current = entry.isIntersecting;
      sync();
    });
    if (el) io.observe(el);

    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stopAutoRotate();
    };
  }, [viewMode, selectedRegion, popup, startAutoRotate, stopAutoRotate]);

  // ─── Smooth Globe Dragging ───
  // FIX: pointer capture used to be taken on pointerdown, which redirected the
  // following `click` to the container, so pins could not be clicked/tapped.
  // Now capture only starts once the pointer actually moves (> 4px).
  const handleGlobePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (viewMode !== "globe") return;
      if ((e.target as HTMLElement).closest("button")) return;
      velocityRef.current = { x: 0, y: 0 };
      downPosRef.current = { x: e.clientX, y: e.clientY };
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    },
    [viewMode],
  );

  const handleGlobePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (viewMode !== "globe" || !downPosRef.current || pinchingRef.current)
        return;

      if (!isDraggingGlobe.current) {
        const moved = Math.hypot(
          e.clientX - downPosRef.current.x,
          e.clientY - downPosRef.current.y,
        );
        if (moved < 4) return;
        isDraggingGlobe.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        try {
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        clearHide();
        setPopup(null);
        return;
      }

      if (!lastMousePos.current) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      const sens = 0.25;
      velocityRef.current = { x: dx * sens, y: dy * sens };

      rotationRef.current = [
        rotationRef.current[0] + dx * sens,
        Math.max(-80, Math.min(80, rotationRef.current[1] - dy * sens)),
        0,
      ];

      // at most one React update per animation frame while dragging
      if (!dragRafRef.current) {
        dragRafRef.current = requestAnimationFrame(() => {
          dragRafRef.current = null;
          setRotation([rotationRef.current[0], rotationRef.current[1], 0]);
        });
      }
    },
    [viewMode, clearHide],
  );

  const handleGlobePointerUp = useCallback(() => {
    if (viewMode !== "globe") return;
    const wasDragging = isDraggingGlobe.current;
    isDraggingGlobe.current = false;
    downPosRef.current = null;
    lastMousePos.current = null;
    if (wasDragging && !selectedRegion) startAutoRotate();
  }, [viewMode, selectedRegion, startAutoRotate]);

  // ─── Touch handling (globe pinch-zoom only) ───
  // In map mode, <ZoomableGroup> (d3-zoom) already handles one-finger pan and
  // two-finger pinch, so the old hand-written map touch code is gone.
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        lastPinchDistance.current = Math.hypot(
          t2.clientX - t1.clientX,
          t2.clientY - t1.clientY,
        );
        pinchingRef.current = true;
        isDraggingGlobe.current = false;
      } else {
        lastPinchDistance.current = null;
      }
    },
    [],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length !== 2) return;
      isDraggingGlobe.current = false;
      pinchingRef.current = true;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      if (lastPinchDistance.current !== null) {
        const delta = dist - lastPinchDistance.current;
        setGlobeScale((s) =>
          Math.max(
            GLOBE_MIN_SCALE,
            Math.min(GLOBE_MAX_SCALE, s + delta * 1.5),
          ),
        );
      }
      lastPinchDistance.current = dist;
    },
    [],
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) lastPinchDistance.current = null;
    if (e.touches.length === 0) pinchingRef.current = false;
  }, []);

  // ─── Non-passive wheel listener (globe only; map zoom is handled by d3) ───
  // FIX: map mode used to be zoomed by this handler AND by ZoomableGroup.
  const mapInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mapInnerRef.current;
    if (!container) return;

    const handler = (e: WheelEvent) => {
      if (viewModeRef.current !== "globe") return;
      if (!container.contains(e.target as Node)) return;
      if (!e.ctrlKey && !e.metaKey) return;

      e.preventDefault();
      const step = e.deltaY > 0 ? -20 : 20;
      setGlobeScale((s) =>
        Math.max(GLOBE_MIN_SCALE, Math.min(GLOBE_MAX_SCALE, s + step)),
      );
    };

    container.addEventListener("wheel", handler, { passive: false });
    return () => container.removeEventListener("wheel", handler);
  }, []);

  // ─── Zoom buttons ───
  const handleGlobeZoomIn = useCallback(
    () => setGlobeScale((s) => Math.min(GLOBE_MAX_SCALE, Math.round(s * 1.35))),
    [],
  );
  const handleGlobeZoomOut = useCallback(
    () => setGlobeScale((s) => Math.max(GLOBE_MIN_SCALE, Math.round(s / 1.35))),
    [],
  );

  const handleZoomIn = () => {
    setPopup(null);
    if (position.zoom < MAP_MAX_ZOOM)
      setPosition((p) => ({
        ...p,
        zoom: Math.min(MAP_MAX_ZOOM, p.zoom * 1.5),
      }));
  };
  const handleZoomOut = () => {
    setPopup(null);
    if (position.zoom > MAP_MIN_ZOOM)
      setPosition((p) => ({
        ...p,
        zoom: Math.max(MAP_MIN_ZOOM, p.zoom / 1.5),
      }));
  };

  // Close popup whenever the user starts panning/zooming the flat map, because
  // the popup anchor is measured once and would otherwise float in the wrong place.
  const handleMapMoveStart = useCallback(() => {
    clearHide();
    setPopup(null);
  }, [clearHide]);

  // ─── Marker popup ───
  const handleMarkerInteraction = useCallback(
    (group: CityGroup, e: React.MouseEvent<SVGGElement>) => {
      e.stopPropagation();
      // FIX: cancel any pending hide timer from the previous pin, otherwise the
      // popup of the pin you just entered gets closed by the old timer.
      clearHide();
      if (!mapContainerRef.current) return;
      const cr = mapContainerRef.current.getBoundingClientRect();
      const mr = (e.currentTarget as SVGGElement).getBoundingClientRect();
      const anchor = {
        x: mr.left + mr.width / 2 - cr.left,
        y: mr.top + mr.height / 2 - cr.top,
      };
      setPopup((prev) =>
        prev && prev.group.id === group.id
          ? { ...prev, group, anchor }
          : { group, anchor, activeIdx: 0 },
      );
    },
    [clearHide],
  );

  const handleMarkerLeave = useCallback(() => scheduleHide(), [scheduleHide]);
  const handlePopupEnter = () => clearHide();
  const handlePopupLeave = () => scheduleHide();

  const handleResetView = () => {
    setSelectedRegion(null);
    setPopup(null);
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region || null);
    setPopup(null);
    if (!region) {
      handleResetView();
      return;
    }
    const target = cityGroups.find((g) => getRegionKey(g) === region);
    if (target) {
      setViewMode("map");
      setPosition({ coordinates: [target.lng, target.lat], zoom: 4 });
    }
  };

  return (
    <section className="w-full py-16 px-4 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-2 md:mb-4">
          <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-black tracking-tight">
            Our Global{" "}
            <span className="text-neutral-400">
              {"Presence".split("").map((char, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h2>
          <p className="text-base md:text-lg text-neutral-500 max-w-5xl mx-auto py-2 md:py-4 leading-relaxed">
            Discover our global footprint through speakers, partners, and events
            worldwide. Hover a pin to explore all entries for that city.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 items-center">
          <div className="flex justify-center mb-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full px-2 py-2 border border-black/20 dark:border-white/20 bg-white/60 dark:bg-[#2a2a2a99] backdrop-blur-md shadow-sm">
              {(["all", "speakers", "leads", "events"] as FilterType[]).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      handleResetView();
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${filter === f ? "bg-black text-white dark:bg-white dark:text-black shadow" : "text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10"}`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedRegion || ""}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full sm:w-64 px-4 py-2.5 rounded-3xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Regions</option>
                {regionOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {selectedRegion && (
              <button
                onClick={handleResetView}
                className="px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                Reset View
              </button>
            )}
          </div>
        </div>

        {/* Outer map container: no overflow-hidden so the popup can float outside */}
        <div
          className="relative border border-neutral-200 dark:border-white/15 rounded-[2.5rem] shadow-3xl select-none"
          style={{ background: containerBg }}
          ref={mapContainerRef}
        >
          {/* View Toggle (no backdrop-blur: it forced a re-blur every frame over the moving globe) */}
          <div className="absolute top-6 right-6 z-30 flex bg-white/90 dark:bg-black/80 border border-neutral-200 dark:border-white/10 p-1 rounded-xl shadow-2xl">
            {["map", "globe"].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode as ViewMode);
                  setPopup(null);
                  setPosition({ coordinates: [0, 0], zoom: 1 });
                }}
                className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all ${viewMode === mode ? "bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white shadow-inner" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"}`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Inner canvas container */}
          <div
            ref={mapInnerRef}
            className="h-[400px] md:h-[600px] w-full relative cursor-grab active:cursor-grabbing overflow-hidden rounded-[2.5rem]"
            style={{ touchAction: "none" }}
            onPointerDown={
              viewMode === "globe" ? handleGlobePointerDown : undefined
            }
            onPointerMove={
              viewMode === "globe" ? handleGlobePointerMove : undefined
            }
            onPointerUp={
              viewMode === "globe" ? handleGlobePointerUp : undefined
            }
            onPointerCancel={
              viewMode === "globe" ? handleGlobePointerUp : undefined
            }
            onPointerLeave={
              viewMode === "globe" ? handleGlobePointerUp : undefined
            }
            onTouchStart={viewMode === "globe" ? handleTouchStart : undefined}
            onTouchMove={viewMode === "globe" ? handleTouchMove : undefined}
            onTouchEnd={viewMode === "globe" ? handleTouchEnd : undefined}
          >
            {MapView && geoData && (
              <MapView
                viewMode={viewMode}
                geoData={geoData}
                globeScale={globeScale}
                position={position}
                rotation={rotation}
                setPosition={setPosition}
                onMoveStart={handleMapMoveStart}
                selectedCountry={selectedCountry}
                landFill={landFill}
                countryStroke={countryStroke}
                countryStrokeWidth={countryStrokeWidth}
                filteredGroups={filteredGroups}
                activeGroupId={popup?.group.id ?? null}
                handleMarkerInteraction={(group, e) =>
                  handleMarkerInteraction(group as CityGroup, e)
                }
                handleMarkerLeave={handleMarkerLeave}
                markerStroke={markerStroke}
                oceanFill={oceanFill}
                sphereStroke={sphereStroke}
                hoverFill={hoverFill}
              />
            )}
          </div>

          {/* ─── Zoom controls ─── */}
          {viewMode === "map" ? (
            <ZoomControls
              onIn={handleZoomIn}
              onOut={handleZoomOut}
              disabledIn={position.zoom >= MAP_MAX_ZOOM}
              disabledOut={position.zoom <= MAP_MIN_ZOOM}
            />
          ) : (
            <ZoomControls
              onIn={handleGlobeZoomIn}
              onOut={handleGlobeZoomOut}
              disabledIn={globeScale >= GLOBE_MAX_SCALE}
              disabledOut={globeScale <= GLOBE_MIN_SCALE}
            />
          )}

          <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-800/90 rounded-3xl px-4 py-2 border border-neutral-300 dark:border-neutral-700 z-10">
            <div className="text-xs md:text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
              Map Navigation
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-0.5">
              <div>• Drag to pan</div>
              <div>• Pinch / Ctrl+Scroll to zoom</div>
              <div>• Hover pin → city list</div>
              <div>• Click entry → details</div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-neutral-800/90 rounded-3xl px-4 py-2 border border-neutral-300 dark:border-neutral-700 z-10 space-y-1">
            {[
              ["bg-blue-500", "Speakers"],
              ["bg-green-500", "Leads"],
              ["bg-amber-500", "Events"],
            ].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${cls}`} />
                <span className="text-xs text-neutral-700 dark:text-neutral-300">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* ─── Popups ─── */}
          <AnimatePresence>
            {popup &&
              (() => {
                const cW = mapContainerRef.current?.offsetWidth ?? 800;
                const isMobileView = cW < 768;
                const hasMany = popup.group.items.length > 1;
                const activeItem = popup.group.items[popup.activeIdx];
                const pW = 360;
                const pHEst = hasMany ? 300 : 240;
                const { left, top, above, arrowLeft } = calcPopupPos(
                  popup.anchor.x,
                  popup.anchor.y,
                  cW,
                  mapContainerRef.current?.offsetHeight ?? 600,
                  pW,
                  pHEst,
                );

                return (
                  <>
                    {isMobileView && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4"
                        onClick={() => setPopup(null)}
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0, y: 20 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.9, opacity: 0, y: 20 }}
                          className="w-full max-w-[500px] bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden pointer-events-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/50">
                            <h3 className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-widest">
                              {popup.group.city}{" "}
                              <span className="text-neutral-400 font-normal">
                                , {popup.group.country}
                              </span>
                            </h3>
                            <button
                              onClick={() => setPopup(null)}
                              className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-white active:scale-90 transition-transform"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-col h-full max-h-[75vh]">
                            {hasMany && (
                              <div className="flex overflow-x-auto border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-950/20 custom-scrollbar">
                                {popup.group.items.map((item, idx) => (
                                  <button
                                    key={item.id}
                                    onClick={() =>
                                      setPopup((p) =>
                                        p ? { ...p, activeIdx: idx } : null,
                                      )
                                    }
                                    className={`flex-shrink-0 px-5 py-4 text-[11px] font-bold transition-all border-b-2 ${popup.activeIdx === idx ? "text-blue-600 border-blue-500 bg-white dark:bg-neutral-800" : "text-neutral-400 border-transparent"}`}
                                  >
                                    {item.name}
                                  </button>
                                ))}
                              </div>
                            )}
                            <div className="overflow-y-auto custom-scrollbar">
                              <PopupDetail item={activeItem} isMobile={true} />
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {!isMobileView && (
                      <motion.div
                        key={`popup-${popup.group.id}`}
                        initial={{ opacity: 0, scale: 0.91, y: above ? 8 : -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.91, y: above ? 8 : -8 }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                        onMouseEnter={handlePopupEnter}
                        onMouseLeave={handlePopupLeave}
                        style={{
                          position: "absolute",
                          left,
                          top,
                          width: pW,
                          zIndex: 50,
                          pointerEvents: "auto",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: arrowLeft - 8,
                            ...(above ? { bottom: -7 } : { top: -7 }),
                            width: 14,
                            height: 14,
                            transform: "rotate(45deg)",
                            border: "1px solid #e5e7eb",
                            zIndex: -1,
                          }}
                          className="bg-white dark:bg-neutral-900 dark:border-neutral-700"
                        />
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                          <div className="bg-neutral-100/80 dark:bg-neutral-800/80 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                            <h3 className="text-[12px] font-black text-neutral-800 dark:text-white uppercase truncate">
                              {popup.group.city}, {popup.group.country}
                            </h3>
                            <button
                              onClick={() => setPopup(null)}
                              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700"
                            >
                              ×
                            </button>
                          </div>
                          <div className="flex" style={{ maxHeight: 260 }}>
                            {hasMany && (
                              <div className="w-[108px] flex-shrink-0 bg-neutral-50 dark:bg-neutral-950/60 border-r dark:border-neutral-800 overflow-y-auto custom-scrollbar">
                                {popup.group.items.map((item, idx) => (
                                  <button
                                    key={item.id}
                                    onMouseEnter={() =>
                                      setPopup((p) =>
                                        p ? { ...p, activeIdx: idx } : null,
                                      )
                                    }
                                    className={`w-full text-left px-2.5 py-3 border-b dark:border-neutral-800 transition-all ${popup.activeIdx === idx ? "bg-white dark:bg-neutral-800 border-r-2 border-r-blue-500" : "opacity-55"}`}
                                  >
                                    <span
                                      className={`block truncate text-[10px] font-bold ${popup.activeIdx === idx ? "text-blue-600" : ""}`}
                                    >
                                      {item.name}
                                    </span>
                                    <span className="block truncate text-[8px] text-neutral-400">
                                      {item.type === "speaker"
                                        ? item.role
                                        : item.date}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                              <PopupDetail item={activeItem} isMobile={false} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                );
              })()}
          </AnimatePresence>
        </div>

        {/* Footer count */}
        <div className="text-center mt-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing{" "}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {filteredGroups.reduce((s, g) => s + g.items.length, 0)}
            </span>{" "}
            entries across{" "}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {filteredGroups.length}
            </span>{" "}
            {filteredGroups.length !== 1 ? "cities" : "city"}
            {selectedRegion && ` in ${selectedRegion}`}
          </p>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 2px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
        select option {
          background: #111;
          color: white;
        }
      `}</style>
    </section>
  );
}
