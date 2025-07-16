"use client";

import { BANGLADESH_BOUNDS, BANGLADESH_CENTER, ViolenceEvent } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

// Hook to dynamically load Leaflet components
function useLeafletComponents() {
    const [components, setComponents] = useState<{
        L: any;
        MapContainer: any;
        TileLayer: any;
        useMap: any;
        EventMarker: any;
    } | null>(null);

    useEffect(() => {
        if (isClient && !components) {
            Promise.all([
                import("leaflet"),
                import("react-leaflet"),
                import("./EventMarker"),
            ])
                .then(([leaflet, reactLeaflet, eventMarker]) => {
                    const L = leaflet.default;

                    // Fix for default markers in react-leaflet
                    delete (L.Icon.Default.prototype as any)._getIconUrl;
                    L.Icon.Default.mergeOptions({
                        iconRetinaUrl:
                            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
                        iconUrl:
                            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                        shadowUrl:
                            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                    });

                    setComponents({
                        L,
                        MapContainer: reactLeaflet.MapContainer,
                        TileLayer: reactLeaflet.TileLayer,
                        useMap: reactLeaflet.useMap,
                        EventMarker: eventMarker.default,
                    });
                })
                .catch((error) => {
                    console.error("Failed to load Leaflet components:", error);
                });
        }
    }, [isClient, components]);

    return components;
}

interface MapViewProps {
    events: ViolenceEvent[];
    selectedEvent?: ViolenceEvent | null;
    onEventSelect?: (event: ViolenceEvent | null) => void;
    className?: string;
    loading?: boolean;
}

// Component to handle map bounds and fit to Bangladesh
function MapController({
    events,
    useMapHook,
}: {
    events: ViolenceEvent[];
    useMapHook: any;
}) {
    const map = useMapHook ? useMapHook() : null;

    useEffect(() => {
        if (events.length > 0) {
            // Create bounds from all event locations
            const group = new L.FeatureGroup(
                events.map((event) =>
                    L.marker([event.location.lat, event.location.lng])
                )
            );

            // Fit map to show all events, with some padding
            if (group.getBounds().isValid()) {
                map.fitBounds(group.getBounds(), { padding: [20, 20] });
            }
        } else {
            // Default view of Bangladesh
            map.setView(BANGLADESH_CENTER, 7);
        }
    }, [events, map]);

    return null;
}

export default function MapView({
    events,
    selectedEvent,
    onEventSelect,
    className = "",
    loading = false,
}: MapViewProps) {
    const [mapReady, setMapReady] = useState(false);
    const mapRef = useRef<any>(null);
    const components = useLeafletComponents();

    // Handle map ready state
    const handleMapReady = () => {
        setMapReady(true);
    };

    // Handle event marker click
    const handleMarkerClick = (event: ViolenceEvent) => {
        onEventSelect?.(event);
    };

    // Handle map click (deselect event)
    const handleMapClick = () => {
        onEventSelect?.(null);
    };

    // Don't render on server side or if components aren't loaded
    if (!isClient || !components) {
        return (
            <div
                className={`relative bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading map...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div
                className={`relative bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading map...</span>
                    </div>
                </div>
            </div>
        );
    }

    const { MapContainer, TileLayer, EventMarker, useMap } = components;

    return (
        <div className={`relative ${className}`}>
            <MapContainer
                center={BANGLADESH_CENTER}
                zoom={7}
                className="h-full w-full rounded-lg z-0"
                whenReady={handleMapReady}
                ref={mapRef}
                onClick={handleMapClick}
                maxBounds={[
                    [BANGLADESH_BOUNDS.south - 1, BANGLADESH_BOUNDS.west - 1],
                    [BANGLADESH_BOUNDS.north + 1, BANGLADESH_BOUNDS.east + 1],
                ]}
                minZoom={6}
                maxZoom={18}
            >
                {/* Base tile layer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Alternative tile layer for better contrast */}
                {/* <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        /> */}

                {/* Map controller for bounds management */}
                <MapController events={events} useMapHook={useMap} />

                {/* Event markers */}
                {mapReady &&
                    events.map((event) => (
                        <EventMarker
                            key={event.id}
                            event={event}
                            isSelected={selectedEvent?.id === event.id}
                            onClick={() => handleMarkerClick(event)}
                        />
                    ))}
            </MapContainer>

            {/* Map overlay info */}
            <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Political Violence Map
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                    {events.length} events displayed
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Severity Levels
                </div>
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            High
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            Medium
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            Low
                        </span>
                    </div>
                </div>
            </div>

            {/* Performance indicator for large datasets */}
            {events.length > 100 && (
                <div className="absolute top-4 right-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-lg text-xs z-10">
                    Large dataset: {events.length} events
                </div>
            )}
        </div>
    );
}
