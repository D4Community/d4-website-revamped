"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  Sphere,
} from "react-simple-maps";

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
      lat: 52.2297,
      lng: 21.0122,
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
      role: "Software Engineer at Scapia",
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
      name: "GenAI Conclave Bangalore 2025",
      date: "Nov 29, 2025",
      attendees: "70+",
    },
    {
      lat: 30.901,
      lng: 75.8573,
      city: "Ludhiana",
      state: "Punjab",
      country: "India",
      name: "GenAI Conclave Ludhiana 2025",
      date: "Sep 06, 2025",
      attendees: "150+",
    },
    {
      lat: 31.326,
      lng: 75.5762,
      city: "Jalandhar",
      state: "Punjab",
      country: "India",
      name: "GenAI Conclave Jalandhar 2025",
      date: "Dec 06, 2025",
      attendees: "250+",
    },
    {
      lat: 30.7333,
      lng: 76.7794,
      city: "Chandigarh",
      state: "Chandigarh",
      country: "India",
      name: "GenAI Conclave Chandigarh 2024",
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
      attendees: "100+",
    },
    {
      lat: 30.7046,
      lng: 76.7179,
      city: "Mohali",
      state: "Punjab",
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
  ],
};

type FilterType = "all" | "speakers" | "leads" | "events";
type ViewMode = "map" | "globe";

function isPointVisible(
  lng: number,
  lat: number,
  rotation: [number, number, number],
): boolean {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const camLng = toRad(-rotation[0]);
  const camLat = toRad(-rotation[1]);
  const ptLng = toRad(lng);
  const ptLat = toRad(lat);
  const dot =
    Math.cos(camLat) * Math.cos(ptLat) * Math.cos(ptLng - camLng) +
    Math.sin(camLat) * Math.sin(ptLat);
  return dot > -0.05;
}

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

// ─── Reactive dark-mode hook ─────────────────────────────────────────────────
// Checks BOTH Tailwind class-based dark mode AND OS-level prefers-color-scheme.
function useDarkMode() {
  const isDarkMode = () => {
    if (typeof window === "undefined") return false;
    if (document.documentElement.classList.contains("dark")) return true;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(isDarkMode());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMqChange = () => setIsDark(isDarkMode());
    mq.addEventListener("change", handleMqChange);
    const observer = new MutationObserver(() => setIsDark(isDarkMode()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      mq.removeEventListener("change", handleMqChange);
      observer.disconnect();
    };
  }, []);

  return isDark;
}

// Theme-aware map colors — matching the reference SVG style:
// Light: white land + dark borders (like a clean atlas)
// Dark:  dark charcoal land + subtle light borders (like the reference)
function useMapTheme(isDark: boolean) {
  return {
    // Land fill — solid so borders are always visible against it
    landFill: isDark ? "#1c1c1e" : "#e8e8e8",
    // Country border stroke
    countryStroke: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
    countryStrokeWidth: isDark ? 0.6 : 0.5,
    // Globe ocean background fill
    oceanFill: isDark ? "#0a0a0a" : "#dde8f0",
    // Globe sphere rim
    sphereStroke: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
    // Hover fill for land in map mode
    hoverFill: isDark ? "#2a2a2e" : "rgba(59,130,246,0.1)",
    // Marker dot outline
    markerStroke: isDark ? "#0a0a0a" : "#ffffff",
  };
}

const GLOBE_MIN_SCALE = 150;
const GLOBE_MAX_SCALE = 650;

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

  const isDark = useDarkMode();
  const {
    landFill,
    countryStroke,
    countryStrokeWidth,
    oceanFill,
    sphereStroke,
    hoverFill,
    markerStroke,
  } = useMapTheme(isDark);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingGlobe = useRef(false);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const rotationRef = useRef<[number, number, number]>([-78, -20, 0]);
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPinchDistance = useRef<number | null>(null);

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
    cityGroups.forEach((g) => {
      const key =
        g.country !== "India"
          ? g.country
          : g.items[0].state
            ? `${g.items[0].state}, India`
            : `${g.city}, India`;
      set.add(key);
    });
    return Array.from(set).sort();
  }, [cityGroups]);

  const filteredGroups = useMemo(() => {
    if (!selectedRegion) return cityGroups;
    return cityGroups.filter((g) => {
      const key =
        g.country !== "India"
          ? g.country
          : g.items[0].state
            ? `${g.items[0].state}, India`
            : `${g.city}, India`;
      return key === selectedRegion;
    });
  }, [cityGroups, selectedRegion]);

  // ─── Auto-rotate ───
  const startAutoRotate = useCallback(() => {
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    autoRotateRef.current = setInterval(() => {
      rotationRef.current = [
        rotationRef.current[0] + 0.3,
        rotationRef.current[1],
        0,
      ];
      setRotation([...rotationRef.current]);
    }, 50);
  }, []);

  const stopAutoRotate = useCallback(() => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (viewMode === "globe" && !selectedRegion && !popup) {
      startAutoRotate();
    } else {
      stopAutoRotate();
    }
    return () => stopAutoRotate();
  }, [viewMode, selectedRegion, popup, startAutoRotate, stopAutoRotate]);

  // ─── Globe drag ───
  const handleGlobePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (viewMode !== "globe") return;
      if ((e.target as HTMLElement).closest("button")) return;
      isDraggingGlobe.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      stopAutoRotate();
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [viewMode, stopAutoRotate],
  );

  const handleGlobePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (
        viewMode !== "globe" ||
        !isDraggingGlobe.current ||
        !lastMousePos.current
      )
        return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      const sens = 0.3;
      rotationRef.current = [
        rotationRef.current[0] + dx * sens,
        Math.max(-80, Math.min(80, rotationRef.current[1] - dy * sens)),
        0,
      ];
      setRotation([...rotationRef.current]);
    },
    [viewMode],
  );

  const handleGlobePointerUp = useCallback(() => {
    if (viewMode !== "globe") return;
    isDraggingGlobe.current = false;
    lastMousePos.current = null;
    if (!selectedRegion && !popup) startAutoRotate();
  }, [viewMode, selectedRegion, popup, startAutoRotate]);

  // ─── Touch handling — pan + pinch-zoom for BOTH globe and flat map ───
  // For the flat map we manually track touch so we can do precise pixel→coordinate conversion.
  // ZoomableGroup's built-in touch handling is disabled (filterZoomEvent blocks touch) to
  // prevent conflicts; we drive position state ourselves.
  const mapTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const mapTouchZoomRef = useRef<number | null>(null); // zoom level at pinch start

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (viewMode === "map") {
        if (e.touches.length === 1) {
          const t = e.touches[0];
          mapTouchStartRef.current = { x: t.clientX, y: t.clientY };
          lastPinchDistance.current = null;
          mapTouchZoomRef.current = null;
        } else if (e.touches.length === 2) {
          const t1 = e.touches[0];
          const t2 = e.touches[1];
          lastPinchDistance.current = Math.hypot(
            t2.clientX - t1.clientX,
            t2.clientY - t1.clientY,
          );
          mapTouchZoomRef.current = null; // will be set on first move
          mapTouchStartRef.current = null; // cancel single-finger pan
        }
      } else {
        // Globe: reset pinch tracker
        lastPinchDistance.current = null;
      }
    },
    [viewMode],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault(); // prevent page scroll while interacting with map

      if (viewMode === "globe") {
        if (e.touches.length === 2) {
          // Globe pinch-to-zoom
          isDraggingGlobe.current = false;
          const t1 = e.touches[0];
          const t2 = e.touches[1];
          const dist = Math.hypot(
            t2.clientX - t1.clientX,
            t2.clientY - t1.clientY,
          );
          if (lastPinchDistance.current !== null) {
            const delta = dist - lastPinchDistance.current;
            setGlobeScale((s) =>
              Math.max(
                GLOBE_MIN_SCALE,
                Math.min(GLOBE_MAX_SCALE, s + delta * 1.8),
              ),
            );
          }
          lastPinchDistance.current = dist;
        }
        // Single-finger globe drag handled by pointer events — no action needed here
        return;
      }

      // ── Flat map mode ──
      if (e.touches.length === 2) {
        // Pinch-to-zoom: scale zoom proportionally to finger distance ratio
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(
          t2.clientX - t1.clientX,
          t2.clientY - t1.clientY,
        );
        if (lastPinchDistance.current !== null && dist > 0) {
          // Use ratio of current to previous distance as zoom multiplier
          const ratio = dist / lastPinchDistance.current;
          setPosition((p) => ({
            ...p,
            zoom: Math.max(1, Math.min(8, p.zoom * ratio)),
          }));
        }
        lastPinchDistance.current = dist;
        mapTouchStartRef.current = null; // no panning during pinch
      } else if (e.touches.length === 1 && mapTouchStartRef.current) {
        // Single-finger pan: convert pixel delta to geographic coordinate delta.
        // The Mercator projection scales 360° of longitude across the full SVG width.
        // At zoom level z, the effective scale is 160*z pixels per "projection unit".
        // We use the container width to figure out how many degrees per pixel.
        const t = e.touches[0];
        const dx = t.clientX - mapTouchStartRef.current.x;
        const dy = t.clientY - mapTouchStartRef.current.y;

        // Degrees per pixel: at scale=160*zoom, the full circumference is 2π*scale pixels.
        // So 1 pixel = 360 / (2π * 160 * zoom) degrees.
        const degsPerPx = 360 / (2 * Math.PI * 160 * position.zoom);
        const lngDelta = -dx * degsPerPx;
        // Mercator latitude is non-linear; approximate with same factor scaled for typical lat range
        const latDelta = dy * degsPerPx * 0.85;

        setPosition((p) => ({
          ...p,
          coordinates: [
            Math.max(-180, Math.min(180, p.coordinates[0] + lngDelta)),
            Math.max(-80, Math.min(80, p.coordinates[1] + latDelta)),
          ] as [number, number],
        }));
        mapTouchStartRef.current = { x: t.clientX, y: t.clientY };
      }
    },
    [viewMode, position.zoom],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length < 2) {
        lastPinchDistance.current = null;
        mapTouchZoomRef.current = null;
      }
      if (e.touches.length === 0) {
        mapTouchStartRef.current = null;
      } else if (e.touches.length === 1 && viewMode === "map") {
        // Finger lifted during pinch — resume pan from remaining finger
        mapTouchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    },
    [viewMode],
  );

  // ─── Non-passive touchmove so we can call preventDefault() ───────────────
  // React synthetic events are passive by default; we need a native listener
  // to block page scroll while the user pans/pinches the map.
  const mapInnerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = mapInnerRef.current;
    if (!el) return;
    const handler = (e: TouchEvent) => {
      if (e.touches.length > 0) e.preventDefault();
    };
    el.addEventListener("touchmove", handler, { passive: false });
    return () => el.removeEventListener("touchmove", handler);
  }, []);
  const handleGlobeWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (viewMode === "globe") {
        const step = e.deltaY > 0 ? -25 : 25;
        setGlobeScale((s) =>
          Math.max(GLOBE_MIN_SCALE, Math.min(GLOBE_MAX_SCALE, s + step)),
        );
      } else {
        // Flat map: scroll-wheel zoom by 15% per tick
        const factor = e.deltaY > 0 ? 1 / 1.15 : 1.15;
        setPosition((p) => ({
          ...p,
          zoom: Math.max(1, Math.min(8, p.zoom * factor)),
        }));
      }
    },
    [viewMode],
  );

  // ─── Globe zoom buttons ───
  const handleGlobeZoomIn = useCallback(
    () => setGlobeScale((s) => Math.min(GLOBE_MAX_SCALE, Math.round(s * 1.35))),
    [],
  );
  const handleGlobeZoomOut = useCallback(
    () => setGlobeScale((s) => Math.max(GLOBE_MIN_SCALE, Math.round(s / 1.35))),
    [],
  );

  // ─── Map zoom buttons ───
  const handleZoomIn = () => {
    if (position.zoom < 8) setPosition((p) => ({ ...p, zoom: p.zoom * 1.5 }));
  };
  const handleZoomOut = () => {
    if (position.zoom > 1)
      setPosition((p) => ({ ...p, zoom: Math.max(1, p.zoom / 1.5) }));
  };

  // ─── Marker popup ───
  const handleMarkerInteraction = useCallback(
    (group: CityGroup, e: React.MouseEvent<SVGGElement>) => {
      e.stopPropagation();
      if (!mapContainerRef.current) return;
      const cr = mapContainerRef.current.getBoundingClientRect();
      const mr = (e.currentTarget as SVGGElement).getBoundingClientRect();
      setPopup({
        group,
        anchor: {
          x: mr.left + mr.width / 2 - cr.left,
          y: mr.top + mr.height / 2 - cr.top,
        },
        activeIdx: 0,
      });
    },
    [],
  );

  const clearHide = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };
  const scheduleHide = (ms = 250) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768)
      hideTimerRef.current = setTimeout(() => setPopup(null), ms);
  };
  const handleMarkerLeave = () => scheduleHide();
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
    const target = cityGroups.find(
      (g) =>
        (g.country !== "India"
          ? g.country
          : g.items[0].state
            ? `${g.items[0].state}, India`
            : `${g.city}, India`) === region,
    );
    if (target) {
      setViewMode("map");
      setPosition({ coordinates: [target.lng, target.lat], zoom: 4 });
    }
  };

  const getTypeColor = (type: string) =>
    type === "speaker" ? "#3b82f6" : type === "lead" ? "#10b981" : "#f59e0b";
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

  // ─── Shared zoom control widget ───
  const ZoomControls = ({
    onIn,
    onOut,
    disabledIn,
    disabledOut,
  }: {
    onIn: () => void;
    onOut: () => void;
    disabledIn: boolean;
    disabledOut: boolean;
  }) => (
    <div className="absolute bottom-6 right-6 z-40 flex flex-col overflow-hidden rounded-xl border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-xl">
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

        {/* Main Map Box — bg matches ocean color for map mode, dark for globe */}
        <div
          className="relative border border-neutral-200 dark:border-white/15 rounded-[2.5rem] overflow-hidden shadow-3xl select-none"
          style={{ background: isDark ? "#080808" : "#dde8f0" }}
          ref={mapContainerRef}
        >
          {/* View Toggle */}
          <div className="absolute top-6 right-6 z-30 flex bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-neutral-200 dark:border-white/10 p-1 rounded-xl shadow-2xl">
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

          <div
            ref={mapInnerRef}
            className="h-[400px] md:h-[600px] w-full relative cursor-grab active:cursor-grabbing"
            style={{ touchAction: viewMode === "globe" ? "none" : "none" }}
            onPointerDown={
              viewMode === "globe" ? handleGlobePointerDown : undefined
            }
            onPointerMove={
              viewMode === "globe" ? handleGlobePointerMove : undefined
            }
            onPointerUp={
              viewMode === "globe" ? handleGlobePointerUp : undefined
            }
            onPointerLeave={
              viewMode === "globe" ? handleGlobePointerUp : undefined
            }
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleGlobeWheel}
          >
            <ComposableMap
              projection={
                viewMode === "globe" ? "geoOrthographic" : "geoMercator"
              }
              projectionConfig={{
                scale: viewMode === "globe" ? globeScale : 160 * position.zoom,
                rotate: viewMode === "globe" ? rotation : [0, 0, 0],
                center: viewMode === "map" ? position.coordinates : [0, 0],
              }}
              style={{
                width: "100%",
                height: "100%",
                pointerEvents: viewMode === "globe" ? "none" : "auto",
              }}
            >
              {viewMode === "map" ? (
                /* ─── MAP MODE ─── */
                <ZoomableGroup
                  center={position.coordinates}
                  zoom={position.zoom}
                  onMoveEnd={({ coordinates, zoom }) =>
                    setPosition({ coordinates, zoom })
                  }
                  filterZoomEvent={(element: SVGElement) => {
                    // The library passes the SVGElement being interacted with, not the event.
                    // We check for touch capability on the window to decide whether to block.
                    if (
                      typeof window !== "undefined" &&
                      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
                    ) {
                      return false;
                    }
                    // Allow interaction on non-touch (desktop) devices
                    return true;
                  }}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const isSelected = selectedRegion?.includes(
                          geo.properties.name,
                        );
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            className="outline-none transition-all duration-200"
                            fill={isSelected ? "#3b82f6" : landFill}
                            stroke={countryStroke}
                            strokeWidth={countryStrokeWidth}
                            style={{
                              default: {
                                outline: "none",
                                fill: isSelected ? "#3b82f6" : landFill,
                                stroke: countryStroke,
                                strokeWidth: countryStrokeWidth,
                              },
                              hover: {
                                outline: "none",
                                fill: isSelected ? "#3b82f6" : hoverFill,
                                stroke: countryStroke,
                                strokeWidth: countryStrokeWidth,
                              },
                              pressed: {
                                outline: "none",
                                fill: isSelected ? "#3b82f6" : landFill,
                                stroke: countryStroke,
                                strokeWidth: countryStrokeWidth,
                              },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {filteredGroups.map((group) => {
                    const color = getTypeColor(group.items[0].type);
                    const isActive = popup?.group.id === group.id;
                    return (
                      <Marker
                        key={group.id}
                        coordinates={[group.lng, group.lat]}
                      >
                        <g
                          style={{ pointerEvents: "visiblePainted" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkerInteraction(group, e);
                          }}
                          onMouseEnter={(e) =>
                            window.innerWidth >= 768 &&
                            handleMarkerInteraction(group, e)
                          }
                          onMouseLeave={() =>
                            window.innerWidth >= 768 && handleMarkerLeave()
                          }
                          className="cursor-pointer"
                        >
                          {/* Large invisible touch target for mobile */}
                          <circle r={18} fill="transparent" />
                          <circle
                            r={isActive ? 12 : 5}
                            fill={color}
                            opacity={0.2}
                            className="animate-pulse"
                          />
                          <circle
                            r={isActive ? 6 : 3.5}
                            fill={color}
                            stroke={markerStroke}
                            strokeWidth={1}
                          />
                        </g>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              ) : (
                /* ─── GLOBE MODE ─── */
                <g>
                  {/* Ocean background — fills the globe disk so land borders contrast */}
                  <Sphere
                    id="rsm-sphere"
                    fill={oceanFill}
                    stroke={sphereStroke}
                    strokeWidth={0.8}
                  />

                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const isSelected = selectedRegion?.includes(
                          geo.properties.name,
                        );
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            className="outline-none"
                            fill={isSelected ? "#3b82f6" : landFill}
                            stroke={countryStroke}
                            strokeWidth={countryStrokeWidth}
                            style={{
                              default: {
                                outline: "none",
                                fill: isSelected ? "#3b82f6" : landFill,
                                stroke: countryStroke,
                                strokeWidth: countryStrokeWidth,
                              },
                              hover: {
                                outline: "none",
                                fill: isSelected ? "#3b82f6" : landFill,
                                stroke: countryStroke,
                                strokeWidth: countryStrokeWidth,
                              },
                              pressed: {
                                outline: "none",
                                fill: isSelected ? "#3b82f6" : landFill,
                                stroke: countryStroke,
                                strokeWidth: countryStrokeWidth,
                              },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {filteredGroups.map((group) => {
                    if (!isPointVisible(group.lng, group.lat, rotation))
                      return null;

                    const color = getTypeColor(group.items[0].type);
                    const isActive = popup?.group.id === group.id;
                    return (
                      <Marker
                        key={group.id}
                        coordinates={[group.lng, group.lat]}
                      >
                        <g
                          style={{ pointerEvents: "visiblePainted" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkerInteraction(
                              group,
                              e as unknown as React.MouseEvent<SVGGElement>,
                            );
                          }}
                          onMouseEnter={(e) => {
                            if (window.innerWidth >= 768)
                              handleMarkerInteraction(
                                group,
                                e as unknown as React.MouseEvent<SVGGElement>,
                              );
                          }}
                          onMouseLeave={() =>
                            window.innerWidth >= 768 && handleMarkerLeave()
                          }
                          className="cursor-pointer"
                        >
                          {/* Large invisible touch target */}
                          <circle
                            r={18}
                            fill="transparent"
                            style={{ pointerEvents: "visiblePainted" }}
                          />
                          <circle
                            r={isActive ? 12 : 5}
                            fill={color}
                            opacity={0.25}
                          />
                          <circle
                            r={isActive ? 6 : 3.5}
                            fill={color}
                            stroke={markerStroke}
                            strokeWidth={1}
                          />
                        </g>
                      </Marker>
                    );
                  })}
                </g>
              )}
            </ComposableMap>
          </div>

          {/* ─── Zoom controls ─── */}
          {viewMode === "map" ? (
            <ZoomControls
              onIn={handleZoomIn}
              onOut={handleZoomOut}
              disabledIn={position.zoom >= 8}
              disabledOut={position.zoom <= 1}
            />
          ) : (
            <ZoomControls
              onIn={handleGlobeZoomIn}
              onOut={handleGlobeZoomOut}
              disabledIn={globeScale >= GLOBE_MAX_SCALE}
              disabledOut={globeScale <= GLOBE_MIN_SCALE}
            />
          )}

          <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-3xl px-4 py-2 border border-neutral-300 dark:border-neutral-700 z-10">
            <div className="text-xs md:text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
              Map Navigation
            </div>

            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-0.5">
              <div>• Drag to pan</div>
              <div>• Scroll to zoom</div>
              <div>• Hover pin → city list</div>
              <div>• Click entry → details</div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-3xl px-4 py-2 border border-neutral-300 dark:border-neutral-700 z-10 space-y-1">
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
                const badge = typeBadge(activeItem.type);
                const accent = typeAccent(activeItem.type);
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

                const DetailContent = ({ isMobile = false }) => (
                  <motion.div
                    key={popup.activeIdx}
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
                        {activeItem.name}
                      </h4>
                      {activeItem.role && (
                        <p
                          className={`${isMobile ? "text-sm" : "text-[11px]"} text-neutral-500 dark:text-neutral-400 mt-1`}
                        >
                          {activeItem.role}
                        </p>
                      )}
                    </div>
                    {activeItem.topic && (
                      <div
                        className={`rounded-xl ${isMobile ? "p-4" : "p-3"} border ${accent.card}`}
                      >
                        <p className="text-[9px] text-neutral-400 font-bold uppercase mb-1 tracking-wider">
                          Topic
                        </p>
                        <p
                          className={`${isMobile ? "text-sm" : "text-[11px]"} text-neutral-800 dark:text-neutral-200 leading-relaxed italic`}
                        >
                          "{activeItem.topic}"
                        </p>
                      </div>
                    )}
                    {activeItem.org && (
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
                            {activeItem.org}
                          </span>
                        </div>
                      </div>
                    )}
                    {activeItem.type === "event" && (
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
                            {activeItem.date}
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
                            {activeItem.attendees}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                      <span className="text-[9px] text-neutral-400">
                        {activeItem.city}, {activeItem.country}
                      </span>
                      <span className="text-[9px] text-neutral-400 font-mono">
                        {activeItem.lat.toFixed(2)}°,{" "}
                        {activeItem.lng.toFixed(2)}°
                      </span>
                    </div>
                  </motion.div>
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
                              <DetailContent isMobile={true} />
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
                          zIndex: 60,
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
                              <DetailContent isMobile={false} />
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
