"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const mapData = {
  speakers: [
    {
      lat: 52.2297,
      lng: 21.0122,
      city: "Katowice, Śląskie",
      country: "Poland",
      name: "Kasia Biernat-Kluba",
      role: "Principal Software Engineer",
      topic: "Beyond the Browser: Angular Meets Generative AI",
    },
    {
      lat: 40.4168,
      lng: -3.7038,
      city: "Greater Madrid Metropolitan Area",
      country: "InSpaindia",
      name: "Victoria Clotet",
      role: "Founder & CEO of Influsfera",
      topic: "AI as Your CTO Co‑Founder: Build Smarter, Not Harder",
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
  ],
  leads: [
    {
      lat: 30.7589,
      lng: 76.7686,
      city: "Chandigarh",
      country: "India",
      name: "Bhumika Varshney",
      role: "Campus Lead",
      org: "CGC University",
    },
    {
      lat: 30.67,
      lng: 76.73,
      city: "Chandigarh",
      country: "India",
      name: "Ishita",
      role: "Campus Lead",
      org: "CGC Landran",
    },
    {
      lat: 30.7589,
      lng: 76.7686,
      city: "Chandigarh",
      country: "India",
      name: "Pawan",
      role: "Campus Lead",
      org: "Chandigarh University",
    },
    {
      lat: 31.254,
      lng: 75.7053,
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
      lat: 12.9716,
      lng: 77.5946,
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
      attendees: "100+",
    },
  ],
};

type FilterType = "all" | "speakers" | "leads" | "events";

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
}

export default function AboutSection() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<
    (Location & { type: string; id: string }) | null
  >(null);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [markerPixelPos, setMarkerPixelPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allLocations = useMemo(() => {
    const locations: (Location & { type: string; id: string })[] = [];

    if (filter === "all" || filter === "speakers") {
      mapData.speakers.forEach((s, idx) =>
        locations.push({ ...s, type: "speaker", id: `speaker-${idx}` }),
      );
    }
    if (filter === "all" || filter === "leads") {
      mapData.leads.forEach((l, idx) =>
        locations.push({ ...l, type: "lead", id: `lead-${idx}` }),
      );
    }
    if (filter === "all" || filter === "events") {
      mapData.events.forEach((e, idx) =>
        locations.push({ ...e, type: "event", id: `event-${idx}` }),
      );
    }

    return locations;
  }, [filter]);

  const groupedByRegion = useMemo(() => {
    const groups: Record<
      string,
      {
        count: number;
        type: string;
        coordinates: [number, number];
      }
    > = {};

    allLocations.forEach((loc) => {
      let key = "";
      let coordinates: [number, number] = [loc.lng, loc.lat];

      if (loc.country !== "India") {
        key = loc.country;
      } else if (["Delhi", "Chandigarh"].includes(loc.city)) {
        key = `${loc.city}, India`;
      } else if (loc.state) {
        key = `${loc.state}, India`;
      } else {
        key = `${loc.city}, India`;
      }

      if (!groups[key]) {
        groups[key] = {
          count: 0,
          type: "region",
          coordinates,
        };
      }
      groups[key].count += 1;
    });

    return groups;
  }, [allLocations]);

  const filteredLocations = useMemo(() => {
    if (!selectedRegion) return allLocations;

    return allLocations.filter((loc) => {
      if (loc.country !== "India") {
        return loc.country === selectedRegion.replace(", India", "");
      } else if (["Delhi", "Chandigarh"].includes(loc.city)) {
        return `${loc.city}, India` === selectedRegion;
      } else if (loc.state) {
        return `${loc.state}, India` === selectedRegion;
      } else {
        return `${loc.city}, India` === selectedRegion;
      }
    });
  }, [allLocations, selectedRegion]);

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setHoveredLocation(null);
    setMarkerPixelPos(null);

    if (groupedByRegion[region]) {
      const { coordinates } = groupedByRegion[region];
      setPosition({
        coordinates,
        zoom: 4,
      });
    }
  };

  const handleResetView = () => {
    setSelectedRegion(null);
    setHoveredLocation(null);
    setMarkerPixelPos(null);
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "speaker":
        return "#3b82f6";
      case "lead":
        return "#10b981";
      case "event":
        return "#f59e0b";
      default:
        return "#ec4899";
    }
  };

  const getMarkerBgColor = (type: string) => {
    switch (type) {
      case "speaker":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "lead":
        return "bg-green-50 dark:bg-green-900/20";
      case "event":
        return "bg-amber-50 dark:bg-amber-900/20";
      default:
        return "bg-pink-50 dark:bg-pink-900/20";
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "speaker":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "lead":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "event":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400";
    }
  };

  const handleMarkerHover = (
    location: Location & { type: string; id: string },
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setHoveredLocation(location);
    calculateAndUpdateMarkerPosition(location);
  };

  const calculateAndUpdateMarkerPosition = (location: Location) => {
    if (!mapContainerRef.current) return;

    const svg = mapContainerRef.current.querySelector("svg");
    if (!svg) return;
    
    const svgRect = svg.getBoundingClientRect();

    // Get the transform applied to the ZoomableGroup
    const g = svg.querySelector("g");
    let transform = { x: 0, y: 0, scale: 1 };

    if (g) {
      const transformAttr = g.getAttribute("transform");
      if (transformAttr) {
        const match = transformAttr.match(
          /translate\(([-\d.]+),\s*([-\d.]+)\)\s*scale\(([-\d.]+)\)/,
        );
        if (match) {
          transform = {
            x: parseFloat(match[1]),
            y: parseFloat(match[2]),
            scale: parseFloat(match[3]),
          };
        }
      }
    }

    // Convert geographic coordinates to pixel coordinates
    // Using simple mercator projection
    const x = (location.lng + 180) * (svgRect.width / 360);
    const latRad = (location.lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = (svgRect.height / 2) - (svgRect.width * mercN / (2 * Math.PI));

    // Apply the current transform
    const transformedX = x * transform.scale + transform.x;
    const transformedY = y * transform.scale + transform.y;

    // Get the map container's position
    const containerRect = mapContainerRef.current.getBoundingClientRect();
    
    // Calculate the screen position relative to the viewport
    const screenX = containerRect.left + transformedX;
    const screenY = containerRect.top + transformedY;

    setMarkerPixelPos({ x: screenX, y: screenY });
  };

  const handleMarkerLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredLocation(null);
      setMarkerPixelPos(null);
    }, 150);
  };

  const handleModalEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleModalLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredLocation(null);
      setMarkerPixelPos(null);
    }, 150);
  };

  const handleZoomIn = () => {
    if (position.zoom >= 8) return;
    const newZoom = position.zoom * 1.5;
    setPosition((pos) => ({ ...pos, zoom: newZoom }));
    if (hoveredLocation) {
      setTimeout(() => calculateAndUpdateMarkerPosition(hoveredLocation), 100);
    }
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    const newZoom = position.zoom / 1.5;
    setPosition((pos) => ({ ...pos, zoom: newZoom }));
    if (hoveredLocation) {
      setTimeout(() => calculateAndUpdateMarkerPosition(hoveredLocation), 100);
    }
  };

  const handlePan = (coordinates: [number, number]) => {
    setPosition((pos) => ({ ...pos, coordinates }));
    if (hoveredLocation) {
      setTimeout(() => calculateAndUpdateMarkerPosition(hoveredLocation), 100);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        hoveredLocation &&
        mapContainerRef.current &&
        !mapContainerRef.current.contains(event.target as Node)
      ) {
        setHoveredLocation(null);
        setMarkerPixelPos(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hoveredLocation]);

  return (
    <section className="w-full px-4 py-12 sm:py-16 md:py-20 overflow-hidden bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-black tracking-tight">
            Our Global{" "}
            <span className="text-neutral-400">
              {"Presence".split("").map((word, idx) => (
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
        
          <p className="text-base md:text-lg text-neutral-500 max-w-5xl mx-auto py-4 md:py-6 leading-relaxed">
            Discover our global footprint through speakers, partners, and events
            worldwide. Hover over markers to see details.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 items-center">
          {/* Main Filters */}
          <div className="flex justify-center mb-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full px-2 py-2 border border-black/20 dark:border-white/20 bg-white/60 dark:bg-[#2a2a2a99] backdrop-blur-md shadow-sm">
              {(["all", "speakers", "leads", "events"] as FilterType[]).map(
                (f) => {
                  const isActive = filter === f;

                  return (
                    <button
                      key={f}
                      onClick={() => {
                        setFilter(f);
                        if (f !== "all") handleResetView();
                      }}
                      className={`
                        px-4 py-1.5 rounded-full text-sm font-medium
                        transition-all duration-200 ease-out
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        ${
                          isActive
                            ? "bg-black text-white dark:bg-white dark:text-black shadow"
                            : "text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10"
                        }
                      `}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* Region Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 max-w-2xl w-auto mb-2">
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedRegion || ""}
                onChange={(e) => handleRegionSelect(e.target.value)}
                className="w-full sm:w-64 px-4 py-2.5 rounded-3xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Regions</option>
                {Object.entries(groupedByRegion)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([region]) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
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

        {/* Map Container */}
        <div className="w-full relative" ref={containerRef}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800 p-1">
            {/* FIXED: Use mapContainerRef here, not containerRef */}
            <div className="relative w-full h-[350px] sm:h-[550px] rounded-xl overflow-hidden" ref={mapContainerRef}>
              <ComposableMap
                projection="geoEqualEarth"
                projectionConfig={{
                  scale: position.zoom === 1 ? 150 : 300 * position.zoom,
                  center: position.coordinates as [number, number],
                }}
                style={{ width: "100%", height: "100%" }}
              >
                <ZoomableGroup
                  center={position.coordinates as [number, number]}
                  zoom={position.zoom}
                  onMoveEnd={({ coordinates, zoom }) => {
                    handlePan(coordinates as [number, number]);
                  }}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const isSelectedRegion =
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
                                fill: isSelectedRegion
                                  ? "#dbeafe"
                                  : position.zoom > 2
                                    ? "#f8fafc"
                                    : "#f1f5f9",
                                stroke: isSelectedRegion
                                  ? "#1d4ed8"
                                  : "#cbd5e1",
                                strokeWidth: isSelectedRegion ? 2 : 0.5,
                                outline: "none",
                              },
                              hover: {
                                fill: isSelectedRegion ? "#dbeafe" : "#e2e8f0",
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

                  {/* Custom Markers for Speakers, Partners, Events */}
                  {filteredLocations.map((location) => {
                    const isHovered = hoveredLocation?.id === location.id;
                    const markerColor = getMarkerColor(location.type);

                    return (
                      <Marker
                        key={location.id}
                        coordinates={[location.lng, location.lat]}
                      >
                        <g
                          onMouseEnter={() => handleMarkerHover(location)}
                          onMouseLeave={handleMarkerLeave}
                          style={{ cursor: "pointer" }}
                        >
                          {/* Pulsing effect on hover */}
                          {isHovered && (
                            <circle
                              r={12}
                              fill={markerColor}
                              opacity={0.3}
                              style={{
                                animation: "pulse 1.5s infinite",
                              }}
                            />
                          )}

                          {/* Main marker circle */}
                          <circle
                            r={isHovered ? 7 : 6}
                            fill={markerColor}
                            stroke="#ffffff"
                            strokeWidth={2}
                            style={{
                              transition: "all 0.2s ease",
                              filter: isHovered
                                ? `drop-shadow(0 0 8px ${markerColor}80)`
                                : "none",
                            }}
                          />

                          {/* Inner dot */}
                          <circle
                            r={isHovered ? 2.5 : 2}
                            fill="#ffffff"
                            style={{
                              transition: "all 0.2s ease",
                            }}
                          />
                        </g>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={handleZoomIn}
                  className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 shadow-lg border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-lg font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-40"
                  disabled={position.zoom >= 8}
                >
                  +
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 shadow-lg border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-lg font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-40"
                  disabled={position.zoom <= 1}
                >
                  −
                </button>
              </div>

              {/* Map Info */}
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-neutral-300 dark:border-neutral-700 z-10">
                <div className="text-sm">
                  <div className="font-small text-neutral-900 dark:text-neutral-100 mb-1">
                    Map Navigation
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                    <div>• Drag to pan</div>
                    <div>• Scroll to zoom</div>
                    <div>• Hover for details</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-neutral-300 dark:border-neutral-700 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-neutral-700 dark:text-neutral-300">
                    Speakers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-neutral-700 dark:text-neutral-300">
                    Partners
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-neutral-700 dark:text-neutral-300">
                    Events
                  </span>
                </div>
              </div>

              {/* Hover Modal - FIXED: Now properly positioned */}
              <AnimatePresence>
                {hoveredLocation && markerPixelPos && (
                  <motion.div
                    key={`modal-${hoveredLocation.id}`}
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed z-50 pointer-events-auto"
                    style={{
                      left: `${markerPixelPos.x}px`,
                      top: `${markerPixelPos.y}px`,
                      transform: "translate(-50%, -100%)",
                      marginTop: "-12px",
                    }}
                    onMouseEnter={handleModalEnter}
                    onMouseLeave={handleModalLeave}
                  >
                    <div className="relative bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-300 dark:border-neutral-700 min-w-[280px] max-w-[320px] p-4">
                      {/* Arrow */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-3 h-3 bg-white dark:bg-neutral-800 rotate-45 border-r border-b border-neutral-300 dark:border-neutral-700"></div>

                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1 truncate">
                            {hoveredLocation.name}
                          </h3>
                          <div
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(hoveredLocation.type)}`}
                          >
                            {hoveredLocation.type === "speaker" && "Speaker"}
                            {hoveredLocation.type === "lead" && "Partner"}
                            {hoveredLocation.type === "event" && "Event"}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      {hoveredLocation.type === "speaker" && (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-500 dark:text-neutral-400">
                              Role:
                            </span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {hoveredLocation.role}
                            </span>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                            <div className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">
                              Topic:
                            </div>
                            <div className="font-medium text-neutral-900 dark:text-neutral-100">
                              "{hoveredLocation.topic}"
                            </div>
                          </div>
                        </div>
                      )}

                      {hoveredLocation.type === "lead" && (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-500 dark:text-neutral-400">
                              Role:
                            </span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {hoveredLocation.role}
                            </span>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                            <div className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">
                              Organization:
                            </div>
                            <div className="font-medium text-neutral-900 dark:text-neutral-100">
                              {hoveredLocation.org}
                            </div>
                          </div>
                        </div>
                      )}

                      {hoveredLocation.type === "event" && (
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">
                                Date
                              </div>
                              <div className="font-medium text-amber-600 dark:text-amber-400">
                                {hoveredLocation.date}
                              </div>
                            </div>
                            <div>
                              <div className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">
                                Attendees
                              </div>
                              <div className="font-medium text-amber-600 dark:text-amber-400">
                                {hoveredLocation.attendees}
                              </div>
                            </div>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
                            <div className="font-medium text-neutral-900 dark:text-neutral-100 text-center">
                              {hoveredLocation.name}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Location */}
                      <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between text-xs">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100">
                            {hoveredLocation.city}, {hoveredLocation.country}
                          </div>
                          <div className="text-neutral-500 dark:text-neutral-400 font-mono">
                            {hoveredLocation.lat.toFixed(2)}°,{" "}
                            {hoveredLocation.lng.toFixed(2)}°
                          </div>
                        </div>
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={() => {
                          setHoveredLocation(null);
                          setMarkerPixelPos(null);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-sm"
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Location Count */}
        <div className="text-center mt-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing{" "}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {filteredLocations.length}
            </span>{" "}
            location{filteredLocations.length !== 1 ? "s" : ""}
            {selectedRegion && ` in ${selectedRegion}`}
          </p>
        </div>
      </div>
    </section>
  );
}