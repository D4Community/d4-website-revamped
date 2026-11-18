"use client";

import React, { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  Sphere,
} from "react-simple-maps";

const MAP_BASE_SCALE = 160;
const MAP_MIN_ZOOM = 1;
const MAP_MAX_ZOOM = 8;
const SELECTED_FILL = "#3b82f6";

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
  return dot > 0.01;
}

const getTypeColor = (type: string) =>
  type === "speaker" ? "#3b82f6" : type === "lead" ? "#10b981" : "#f59e0b";

type PinGroup = {
  id: string;
  lat: number;
  lng: number;
  items: { type: string }[];
};

export type MapCanvasProps = {
  viewMode: "map" | "globe";
  geoData: object;
  globeScale: number;
  position: { coordinates: [number, number]; zoom: number };
  rotation: [number, number, number];
  setPosition: React.Dispatch<
    React.SetStateAction<{ coordinates: [number, number]; zoom: number }>
  >;
  onMoveStart: () => void;
  selectedCountry: string | null;
  landFill: string;
  countryStroke: string;
  countryStrokeWidth: number;
  filteredGroups: PinGroup[];
  activeGroupId: string | null;
  handleMarkerInteraction: (
    group: PinGroup,
    e: React.MouseEvent<SVGGElement>,
  ) => void;
  handleMarkerLeave: () => void;
  markerStroke: string;
  oceanFill: string;
  sphereStroke: string;
  hoverFill: string;
};

export const MapCanvas = React.memo(function MapCanvas({
  viewMode,
  geoData,
  globeScale,
  position,
  rotation,
  setPosition,
  onMoveStart,
  selectedCountry,
  landFill,
  countryStroke,
  countryStrokeWidth,
  filteredGroups,
  activeGroupId,
  handleMarkerInteraction,
  handleMarkerLeave,
  markerStroke,
  oceanFill,
  sphereStroke,
  hoverFill,
}: MapCanvasProps) {
  const isGlobe = viewMode === "globe";
  const k = isGlobe ? 1 : position.zoom;
  const strokeW = countryStrokeWidth / k;

  const styles = useMemo(() => {
    const make = (fill: string) => ({
      outline: "none",
      fill,
      stroke: countryStroke,
      strokeWidth: strokeW,
    });
    const land = make(landFill);
    const selected = make(SELECTED_FILL);
    const hover = make(isGlobe ? landFill : hoverFill);
    return {
      normal: { default: land, hover, pressed: land },
      selected: { default: selected, hover: selected, pressed: selected },
    };
  }, [landFill, hoverFill, countryStroke, strokeW, isGlobe]);

  const renderGeographies = () => (
    <Geographies geography={geoData}>
      {({ geographies }) =>
        geographies.map((geo) => {
          const isSelected =
            !!selectedCountry && geo.properties.name === selectedCountry;
          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              className="outline-none"
              style={isSelected ? styles.selected : styles.normal}
            />
          );
        })
      }
    </Geographies>
  );

  const renderMarkers = (onlyVisible: boolean) =>
    filteredGroups.map((group) => {
      if (onlyVisible && !isPointVisible(group.lng, group.lat, rotation))
        return null;

      const color = getTypeColor(group.items[0].type);
      const isActive = activeGroupId === group.id;
      return (
        <Marker key={group.id} coordinates={[group.lng, group.lat]}>
          <g
            style={{ pointerEvents: "visiblePainted" }}
            onClick={(e) => {
              e.stopPropagation();
              handleMarkerInteraction(group, e);
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) handleMarkerInteraction(group, e);
            }}
            onMouseLeave={() => {
              if (window.innerWidth >= 768) handleMarkerLeave();
            }}
            className="cursor-pointer"
          >
            <circle
              r={18 / k}
              fill="transparent"
              style={{ pointerEvents: "visiblePainted" }}
            />
            <circle
              r={(isActive ? 12 : 5) / k}
              fill={color}
              opacity={0.2}
              className={isGlobe ? undefined : "animate-pulse"}
            />
            <circle
              r={(isActive ? 6 : 3.5) / k}
              fill={color}
              stroke={markerStroke}
              strokeWidth={1 / k}
            />
          </g>
        </Marker>
      );
    });

  return (
    <ComposableMap
      projection={isGlobe ? "geoOrthographic" : "geoMercator"}
      projectionConfig={{
        scale: isGlobe ? globeScale : MAP_BASE_SCALE,
        rotate: isGlobe ? rotation : [0, 0, 0],
        center: [0, 0],
      }}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: isGlobe ? "none" : "auto",
      }}
    >
      {!isGlobe ? (
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          minZoom={MAP_MIN_ZOOM}
          maxZoom={MAP_MAX_ZOOM}
          onMoveStart={onMoveStart}
          onMoveEnd={({ coordinates, zoom }) =>
            setPosition({ coordinates, zoom })
          }
          filterZoomEvent={(event) => {
            // @types says SVGElement; d3-zoom passes the source event.
            const e = event as unknown as {
              type: string;
              ctrlKey: boolean;
              metaKey: boolean;
              button: number;
            };
            if (e.type === "wheel") return !!(e.ctrlKey || e.metaKey);
            if (e.type === "dblclick") return false;
            return !e.button;
          }}
        >
          {renderGeographies()}
          {renderMarkers(false)}
        </ZoomableGroup>
      ) : (
        <g>
          <Sphere
            id="rsm-sphere"
            fill={oceanFill}
            stroke={sphereStroke}
            strokeWidth={0.8}
          />
          {renderGeographies()}
          {renderMarkers(true)}
        </g>
      )}
    </ComposableMap>
  );
});
