"use client";

import { SeverityLevel, ViolenceEvent } from "@/types";
import { useEffect, useRef } from "react";
import EventPopup from "./EventPopup";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

// Only import Leaflet on client side
let L: any;
let Marker: any;
let Popup: any;

if (isClient) {
    L = require("leaflet");
    const reactLeaflet = require("react-leaflet");
    Marker = reactLeaflet.Marker;
    Popup = reactLeaflet.Popup;
}

interface EventMarkerProps {
    event: ViolenceEvent;
    isSelected?: boolean;
    onClick?: () => void;
}

// Color mapping for severity levels
const SEVERITY_COLORS: Record<SeverityLevel, string> = {
    high: "#ef4444", // red-500
    medium: "#f97316", // orange-500
    low: "#eab308", // yellow-500
};

// Create custom marker icons based on severity and selection state
function createMarkerIcon(
    severity: SeverityLevel,
    isSelected: boolean = false,
    isRecent: boolean = false
) {
    const color = SEVERITY_COLORS[severity];
    const size = isSelected ? 32 : 24;
    const pulseClass = isRecent ? "animate-pulse" : "";

    // Create SVG icon
    const svgIcon = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <circle 
        cx="12" 
        cy="12" 
        r="${isSelected ? "10" : "8"}" 
        fill="${color}" 
        stroke="white" 
        stroke-width="${isSelected ? "3" : "2"}"
        filter="url(#shadow)"
        class="${pulseClass}"
      />
      ${
          isSelected
              ? '<circle cx="12" cy="12" r="4" fill="white" opacity="0.8"/>'
              : ""
      }
    </svg>
  `;

    return L.divIcon({
        html: svgIcon,
        className: "custom-marker-icon",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
    });
}

// Check if event is recent (within last 7 days)
function isRecentEvent(dateString: string): boolean {
    const eventDate = new Date(dateString);
    const now = new Date();
    const daysDiff =
        (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
}

export default function EventMarker({
    event,
    isSelected = false,
    onClick,
}: EventMarkerProps) {
    const markerRef = useRef<L.Marker | null>(null);
    const isRecent = isRecentEvent(event.date);

    // Create the appropriate icon based on event properties
    const icon = createMarkerIcon(event.severity, isSelected, isRecent);

    // Handle marker click
    const handleClick = () => {
        onClick?.();
    };

    // Auto-open popup for selected events
    useEffect(() => {
        if (isSelected && markerRef.current) {
            markerRef.current.openPopup();
        }
    }, [isSelected]);

    // Don't render on server side
    if (!isClient || !Marker || !Popup) {
        return null;
    }

    return (
        <Marker
            position={[event.location.lat, event.location.lng]}
            icon={icon}
            ref={markerRef}
            eventHandlers={{
                click: handleClick,
            }}
        >
            <Popup
                closeButton={true}
                autoClose={false}
                closeOnClick={false}
                className="custom-popup"
                maxWidth={320}
                minWidth={280}
            >
                <EventPopup event={event} />
            </Popup>
        </Marker>
    );
}
