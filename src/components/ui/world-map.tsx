"use client";

import { useRef } from "react";
import DottedMap from "dotted-map";

import { useTheme } from "next-themes";

interface MapProps {
  locations?: Array<{
    lat: number;
    lng: number;
    label?: string;
  }>;
  dotColor?: string;
}

export default function WorldMap({
  locations = [],
  dotColor = "#ec4899",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const map = new DottedMap({ height: 100, grid: "diagonal" });

  const { theme } = useTheme();

  const svgMap = map.getSVG({
    radius: 0.22,
    color: theme === "dark" ? "#FFFFFF30" : "#9B9B9D",
    shape: "circle",
    backgroundColor: "transparent",
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  return (
    <div
      className="w-full relative font-sans"
      style={{ perspective: "1000px" }}
    >
      <div
        className="w-full"
        style={{
          transform: "rotateX(30deg)",
          transformOrigin: "center center",
        }}
      >
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-full w-full pointer-events-none select-none"
          alt="world map"
          height="495"
          width="1056"
          draggable={false}
        />
        <svg
          ref={svgRef}
          viewBox="0 0 800 400"
          className="w-full h-full absolute inset-0 pointer-events-none select-none"
        >
          {locations.map((location, i) => {
            const point = projectPoint(location.lat, location.lng);
            return (
              <g key={`location-${i}`}>
                <circle cx={point.x} cy={point.y} r="3" fill={dotColor} />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill={dotColor}
                  opacity="0.4"
                >
                  <animate
                    attributeName="r"
                    from="3"
                    to="8"
                    dur="1.5s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.4"
                    to="0"
                    dur="1.5s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>
                {location.label && (
                  <text
                  
                    x={point.x}
                    y={point.y - 8}
                    textAnchor="middle"
                    fill={theme === "dark" ? "#ffffff" : "#000000"}
                    fontSize="10"
                    fontWeight="500"
                    className="select-none"
                  >
                    {location.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
