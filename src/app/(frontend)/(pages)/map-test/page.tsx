"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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
  x: number; // px from container left
  y: number; // px from container top
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
      lat: 28.6139,
      lng: 77.209,
      city: "Delhi",
      country: "India",
      name: "Chhavi Garg",
      role: "Founder & CEO of BharatXR",
      topic: "Build With AR",
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

function calcPopupPos(
  anchorX: number,
  anchorY: number,
  containerW: number,
  containerH: number,
  popupW: number,
  popupH: number,
  markerRadius = 10,
  margin = 8,
) {
  const gap = markerRadius + 6;
  const above = anchorY - gap >= popupH + margin;
  const top = above ? anchorY - gap - popupH : anchorY + gap;
  let left = anchorX - popupW / 2;
  left = Math.max(margin, Math.min(left, containerW - popupW - margin));
  const arrowLeft = Math.max(14, Math.min(anchorX - left, popupW - 14));
  return { left, top, above, arrowLeft };
}

export default function AboutSection() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [position, setPosition] = useState<{
    coordinates: [number, number];
    zoom: number;
  }>({
    coordinates: [0, 0],
    zoom: 1,
  });
  const [popup, setPopup] = useState<{
    group: CityGroup;
    anchor: AnchorPos;
    activeIdx: number;
  } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Data ────────────────────────────────────────────────────────────────────

  const cityGroups = useMemo<CityGroup[]>(() => {
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
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          city: item.city,
          country: item.country,
          lat: item.lat,
          lng: item.lng,
          items: [],
        });
      }
      const g = map.get(key)!;
      g.items.push(item);
      const n = g.items.length;
      g.lat = g.items.reduce((s, l) => s + l.lat, 0) / n;
      g.lng = g.items.reduce((s, l) => s + l.lng, 0) / n;
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

  const filteredGroups = useMemo<CityGroup[]>(() => {
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

  // ─── Popup helpers ───────────────────────────────────────────────────────────

  const clearHide = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleHide = (ms = 250) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      hideTimerRef.current = setTimeout(() => setPopup(null), ms);
    }
  };

  const anchorFromSVGEvent = useCallback(
    (e: React.MouseEvent<SVGGElement>): AnchorPos | null => {
      if (!mapContainerRef.current) return null;
      const containerRect = mapContainerRef.current.getBoundingClientRect();
      const markerRect = (
        e.currentTarget as SVGGElement
      ).getBoundingClientRect();
      return {
        x: markerRect.left + markerRect.width / 2 - containerRect.left,
        y: markerRect.top + markerRect.height / 2 - containerRect.top,
      };
    },
    [],
  );

  const handleMarkerInteraction = useCallback(
    (group: CityGroup, e: React.MouseEvent<SVGGElement>) => {
      e.stopPropagation();
      clearHide();
      const anchor = anchorFromSVGEvent(e);
      if (!anchor) return;
      setPopup((prev) => ({
        group,
        anchor,
        activeIdx: prev?.group.id === group.id ? prev.activeIdx : 0,
      }));
    },
    [anchorFromSVGEvent],
  );

  const handleMarkerLeave = () => scheduleHide();
  const handlePopupEnter = () => clearHide();
  const handlePopupLeave = () => scheduleHide();

  // ─── Map controls ────────────────────────────────────────────────────────────

  const handleResetView = () => {
    setSelectedRegion(null);
    setPopup(null);
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region || null);
    setPopup(null);
    if (!region) {
      setPosition({ coordinates: [0, 0], zoom: 1 });
      return;
    }
    const target = cityGroups.find((g) => {
      const key =
        g.country !== "India"
          ? g.country
          : g.items[0].state
            ? `${g.items[0].state}, India`
            : `${g.city}, India`;
      return key === region;
    });
    if (target) setPosition({ coordinates: [target.lng, target.lat], zoom: 4 });
  };

  const handleZoomIn = () => {
    if (position.zoom < 8) setPosition((p) => ({ ...p, zoom: p.zoom * 1.5 }));
  };
  const handleZoomOut = () => {
    if (position.zoom > 1)
      setPosition((p) => ({ ...p, zoom: Math.max(1, p.zoom / 1.5) }));
  };

  const handleMoveEnd = ({
    coordinates,
    zoom,
  }: {
    coordinates: [number, number];
    zoom: number;
  }) => {
    setPosition({ coordinates, zoom });
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setPopup(null);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        mapContainerRef.current &&
        !mapContainerRef.current.contains(e.target as Node)
      ) {
        setPopup(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(
    () => () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    },
    [],
  );

  const getTypeColor = (type: string) =>
    type === "speaker" ? "#3b82f6" : type === "lead" ? "#10b981" : "#f59e0b";

  const getClusterColor = (items: Location[]) => {
    if (items.length === 1) return getTypeColor(items[0].type);
    const counts: Record<string, number> = {};
    items.forEach((i) => {
      counts[i.type] = (counts[i.type] || 0) + 1;
    });
    return getTypeColor(
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0],
    );
  };

  const typeBadge = (type: string) => {
    if (type === "speaker")
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        label: "Speaker",
      };
    if (type === "lead")
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        label: "Leads",
      };
    return {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      label: "Event",
    };
  };

  const typeAccent = (type: string) => {
    if (type === "speaker")
      return {
        card: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
        accent: "text-blue-600 dark:text-blue-400",
      };
    if (type === "lead")
      return {
        card: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",
        accent: "text-green-600 dark:text-green-400",
      };
    return {
      card: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800",
      accent: "text-amber-600 dark:text-amber-400",
    };
  };

  return (
    <section className="w-full mt-16 md:mt-24 px-4 py-12 sm:py-16 md:py-20 overflow-hidden bg-white dark:bg-neutral-950">
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
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      filter === f
                        ? "bg-black text-white dark:bg-white dark:text-black shadow"
                        : "text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
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

        {/* Map */}
        <div className="w-full">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800 p-1">
            <div
              className="relative w-full h-[350px] sm:h-[600px] rounded-xl"
              style={{ overflow: "visible" }}
              ref={mapContainerRef}
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <ComposableMap
                  projection="geoEqualEarth"
                  projectionConfig={{
                    scale: position.zoom === 1 ? 150 : 300 * position.zoom,
                    center: position.coordinates,
                  }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <ZoomableGroup
                    center={position.coordinates}
                    zoom={position.zoom}
                    onMoveEnd={handleMoveEnd}
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const isSelected =
                            selectedRegion &&
                            (geo.properties.name ===
                              selectedRegion.replace(", India", "") ||
                              geo.properties.name ===
                                selectedRegion.split(",")[0]);
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              style={{
                                default: {
                                  fill: isSelected ? "#dbeafe" : "#f1f5f9",
                                  stroke: isSelected ? "#1d4ed8" : "#cbd5e1",
                                  strokeWidth: isSelected ? 2 : 0.5,
                                  outline: "none",
                                },
                                hover: {
                                  fill: isSelected ? "#dbeafe" : "#e2e8f0",
                                  stroke: "#3b82f6",
                                  strokeWidth: 1,
                                  outline: "none",
                                },
                                pressed: {
                                  fill: "#3b82f6",
                                  stroke: "#1d4ed8",
                                  strokeWidth: 2,
                                  outline: "none",
                                },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>

                    {filteredGroups.map((group) => {
                      const isActive = popup?.group.id === group.id;
                      const color = getClusterColor(group.items);
                      const count = group.items.length;
                      const isCluster = count > 1;

                      return (
                        <Marker
                          key={group.id}
                          coordinates={[group.lng, group.lat]}
                        >
                          <g
                            onMouseEnter={(e) =>
                              handleMarkerInteraction(group, e)
                            }
                            onClick={(e) => handleMarkerInteraction(group, e)}
                            onMouseLeave={handleMarkerLeave}
                            style={{ cursor: "pointer" }}
                          >
                            {isActive && (
                              <circle r={18} fill={color} opacity={0.12}>
                                <animate
                                  attributeName="r"
                                  values="12;22;12"
                                  dur="1.8s"
                                  repeatCount="indefinite"
                                />
                                <animate
                                  attributeName="opacity"
                                  values="0.18;0;0.18"
                                  dur="1.8s"
                                  repeatCount="indefinite"
                                />
                              </circle>
                            )}
                            <circle
                              r={isCluster ? 10 : 7}
                              fill={color}
                              stroke="#ffffff"
                              strokeWidth={2.5}
                              style={{
                                transition: "r 0.15s ease",
                                filter: isActive
                                  ? `drop-shadow(0 0 6px ${color}90)`
                                  : "none",
                              }}
                            />
                            {isCluster ? (
                              <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{
                                  fill: "#fff",
                                  fontSize: count >= 10 ? "6px" : "7.5px",
                                  fontWeight: 800,
                                  pointerEvents: "none",
                                  userSelect: "none",
                                }}
                              >
                                {count}
                              </text>
                            ) : (
                              <circle r={2.5} fill="#ffffff" />
                            )}
                          </g>
                        </Marker>
                      );
                    })}
                  </ZoomableGroup>
                </ComposableMap>
              </div>

              {/* Zoom controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={handleZoomIn}
                  disabled={position.zoom >= 8}
                  className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 shadow-lg border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-lg font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-40"
                >
                  +
                </button>
                <button
                  onClick={handleZoomOut}
                  disabled={position.zoom <= 1}
                  className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 shadow-lg border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-lg font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-40"
                >
                  −
                </button>
              </div>

              <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-neutral-300 dark:border-neutral-700 z-10">
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
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-neutral-300 dark:border-neutral-700 z-10 space-y-1">
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

              <AnimatePresence>
                {popup &&
                  (() => {
                    const cW = mapContainerRef.current?.offsetWidth ?? 800;
                    const isMobileView = cW < 768;
                    const hasMany = popup.group.items.length > 1;

                    const activeItem = popup.group.items[popup.activeIdx];
                    const badge = typeBadge(activeItem.type);
                    const accent = typeAccent(activeItem.type);

                    // Desktop Positioning Logic
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

                    // Shared Detail Content Component to ensure no data is missing
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
                        {/* MOBILE VIEW: Full-screen optimized modal */}
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
                              {/* Mobile Header */}
                              <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/50">
                                <div className="min-w-0">
                                  <h3 className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-widest">
                                    {popup.group.city}{" "}
                                    <span className="text-neutral-400 font-normal">
                                      , {popup.group.country}
                                    </span>
                                  </h3>
                                </div>
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
                                        className={`flex-shrink-0 px-5 py-4 text-[11px] font-bold transition-all border-b-2 ${
                                          popup.activeIdx === idx
                                            ? "text-blue-600 border-blue-500 bg-white dark:bg-neutral-800"
                                            : "text-neutral-400 border-transparent"
                                        }`}
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

                        {/* DESKTOP VIEW: Pin-anchored Tooltip (UI untouched) */}
                        {!isMobileView && (
                          <motion.div
                            key={`popup-${popup.group.id}`}
                            initial={{
                              opacity: 0,
                              scale: 0.91,
                              y: above ? 8 : -8,
                            }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{
                              opacity: 0,
                              scale: 0.91,
                              y: above ? 8 : -8,
                            }}
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
                                background: "inherit",
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
          </div>
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
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </section>
  );
}
