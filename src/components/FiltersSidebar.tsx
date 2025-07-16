"use client";

import { BANGLADESH_DIVISIONS, FilterOptions, SeverityLevel } from "@/types";
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Filter,
    MapPin,
    RotateCcw,
    Users,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface FiltersSidebarProps {
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
    availableParties: string[];
    availableDistricts: string[];
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
}

export default function FiltersSidebar({
    filters,
    onFiltersChange,
    availableParties,
    availableDistricts,
    isOpen,
    onToggle,
    className = "",
}: FiltersSidebarProps) {
    const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

    // Update local filters when props change
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // Apply filters
    const applyFilters = () => {
        onFiltersChange(localFilters);
    };

    // Reset all filters
    const resetFilters = () => {
        const resetFilters: FilterOptions = {
            dateRange: { start: null, end: null },
            politicalParties: [],
            divisions: [],
            districts: [],
            severityLevels: [],
            verifiedOnly: false,
        };
        setLocalFilters(resetFilters);
        onFiltersChange(resetFilters);
    };

    // Handle date range changes
    const handleDateRangeChange = (field: "start" | "end", value: string) => {
        setLocalFilters((prev) => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [field]: value ? new Date(value) : null,
            },
        }));
    };

    // Handle multi-select changes
    const handleMultiSelectChange = (
        field: keyof Pick<
            FilterOptions,
            "politicalParties" | "divisions" | "districts" | "severityLevels"
        >,
        value: string
    ) => {
        setLocalFilters((prev) => {
            const currentValues = prev[field] as string[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];

            return {
                ...prev,
                [field]: newValues,
            };
        });
    };

    // Count active filters
    const activeFiltersCount =
        (localFilters.dateRange.start || localFilters.dateRange.end ? 1 : 0) +
        localFilters.politicalParties.length +
        localFilters.divisions.length +
        localFilters.districts.length +
        localFilters.severityLevels.length +
        (localFilters.verifiedOnly ? 1 : 0);

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed lg:relative top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        w-80 flex flex-col
        ${className}
      `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Filters
                        </h2>
                        {activeFiltersCount > 0 && (
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onToggle}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filters content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                    {/* Date Range Filter */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                Date Range
                            </h3>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    From
                                </label>
                                <input
                                    type="date"
                                    value={
                                        localFilters.dateRange.start
                                            ? localFilters.dateRange.start
                                                  .toISOString()
                                                  .split("T")[0]
                                            : ""
                                    }
                                    onChange={(e) =>
                                        handleDateRangeChange(
                                            "start",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    To
                                </label>
                                <input
                                    type="date"
                                    value={
                                        localFilters.dateRange.end
                                            ? localFilters.dateRange.end
                                                  .toISOString()
                                                  .split("T")[0]
                                            : ""
                                    }
                                    onChange={(e) =>
                                        handleDateRangeChange(
                                            "end",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Political Parties Filter */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                Political Parties
                            </h3>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {availableParties.map((party) => (
                                <label
                                    key={party}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={localFilters.politicalParties.includes(
                                            party
                                        )}
                                        onChange={() =>
                                            handleMultiSelectChange(
                                                "politicalParties",
                                                party
                                            )
                                        }
                                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {party}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Divisions Filter */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                Divisions
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {BANGLADESH_DIVISIONS.map((division) => (
                                <label
                                    key={division}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={localFilters.divisions.includes(
                                            division
                                        )}
                                        onChange={() =>
                                            handleMultiSelectChange(
                                                "divisions",
                                                division
                                            )
                                        }
                                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {division}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Severity Levels Filter */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                Severity
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {(["high", "medium", "low"] as SeverityLevel[]).map(
                                (level) => (
                                    <label
                                        key={level}
                                        className="flex items-center space-x-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={localFilters.severityLevels.includes(
                                                level
                                            )}
                                            onChange={() =>
                                                handleMultiSelectChange(
                                                    "severityLevels",
                                                    level
                                                )
                                            }
                                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                            {level}
                                        </span>
                                    </label>
                                )
                            )}
                        </div>
                    </div>

                    {/* Verified Only Filter */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                Verification
                            </h3>
                        </div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localFilters.verifiedOnly}
                                onChange={(e) =>
                                    setLocalFilters((prev) => ({
                                        ...prev,
                                        verifiedOnly: e.target.checked,
                                    }))
                                }
                                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Verified events only
                            </span>
                        </label>
                    </div>
                </div>

                {/* Footer with action buttons */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <button
                        onClick={applyFilters}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={resetFilters}
                        className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset All</span>
                    </button>
                </div>
            </div>
        </>
    );
}
