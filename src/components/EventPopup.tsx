"use client";

import { SeverityLevel, ViolenceEvent } from "@/types";
import { format } from "date-fns";
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    ExternalLink,
    Heart,
    MapPin,
    Skull,
    Users,
    XCircle,
} from "lucide-react";
import Image from "next/image";

interface EventPopupProps {
    event: ViolenceEvent;
    showFullDetails?: boolean;
}

// Severity level styling
const SEVERITY_STYLES: Record<
    SeverityLevel,
    { bg: string; text: string; border: string }
> = {
    high: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-200",
        border: "border-red-200 dark:border-red-700",
    },
    medium: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-800 dark:text-orange-200",
        border: "border-orange-200 dark:border-orange-700",
    },
    low: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-200",
        border: "border-yellow-200 dark:border-yellow-700",
    },
};

export default function EventPopup({
    event,
    showFullDetails = false,
}: EventPopupProps) {
    const severityStyle = SEVERITY_STYLES[event.severity];
    const eventDate = new Date(event.date);
    const totalCasualties = event.casualties.injured + event.casualties.dead;

    return (
        <div className="space-y-3 text-sm">
            {/* Header */}
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                    {event.title}
                </h3>

                {/* Severity badge */}
                <div className="flex items-center justify-between">
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${severityStyle.bg} ${severityStyle.text} ${severityStyle.border}`}
                    >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {event.severity.toUpperCase()}
                    </span>

                    {/* Verification status */}
                    <div className="flex items-center space-x-1">
                        {event.verified ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span
                            className={`text-xs ${
                                event.verified
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-500"
                            }`}
                        >
                            {event.verified ? "Verified" : "Unverified"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Event image */}
            {event.imageUrl && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 320px) 100vw, 320px"
                        onError={(e) => {
                            // Hide the image container if it fails to load
                            const target = e.target as HTMLImageElement;
                            const container = target.closest("div");
                            if (container) {
                                container.style.display = "none";
                            }
                        }}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rj5m1leJ4VjjjMbTQyGWJwVZGU4II6EEbEV9K22Ov7a4QIbS2jt7dM7QQRhEX/lQhVA9hgV8s/9k="
                    />
                </div>
            )}

            {/* Summary */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {event.summary}
            </p>

            {/* Key details */}
            <div className="space-y-2">
                {/* Date and time */}
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{format(eventDate, "PPP")}</span>
                    <span className="text-xs">({format(eventDate, "p")})</span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location.address}</span>
                </div>

                {/* Political parties involved */}
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">
                        <span className="font-medium">
                            {event.politicalParty}
                        </span>
                        {event.opposingParty && (
                            <>
                                <span className="mx-1">vs</span>
                                <span className="font-medium">
                                    {event.opposingParty}
                                </span>
                            </>
                        )}
                    </span>
                </div>
            </div>

            {/* Casualties */}
            {totalCasualties > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-xs uppercase tracking-wide">
                        Casualties
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                        {event.casualties.injured > 0 && (
                            <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                                <Heart className="w-4 h-4" />
                                <span>{event.casualties.injured} injured</span>
                            </div>
                        )}
                        {event.casualties.dead > 0 && (
                            <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                                <Skull className="w-4 h-4" />
                                <span>{event.casualties.dead} dead</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Source and additional details */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Source: {event.source}</span>
                    <button className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <ExternalLink className="w-3 h-3" />
                        <span>Details</span>
                    </button>
                </div>
            </div>

            {/* Administrative info */}
            {showFullDetails && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Division:</span>{" "}
                        {event.location.division}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">District:</span>{" "}
                        {event.location.district}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Event ID:</span>{" "}
                        {event.id}
                    </div>
                </div>
            )}
        </div>
    );
}
