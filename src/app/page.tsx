"use client";

import DynamicMapView from "@/components/DynamicMapView";
import FiltersSidebar from "@/components/FiltersSidebar";
import { useApp } from "@/contexts/AppContext";
import { AlertCircle, Loader2, Menu, Moon, Sun } from "lucide-react";

export default function Home() {
    const { state, actions } = useApp();

    const {
        filteredEvents,
        selectedEvent,
        loading,
        error,
        sidebarOpen,
        darkMode,
        filters,
        availableParties,
        availableDistricts,
    } = state;

    const {
        applyFilters,
        selectEvent,
        toggleSidebar,
        toggleDarkMode,
        setSidebarOpen,
    } = actions;

    // Handle mobile sidebar close
    const handleMobileSidebarClose = () => {
        setSidebarOpen(false);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Failed to Load Data
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
            {/* Filters Sidebar */}
            <FiltersSidebar
                filters={filters}
                onFiltersChange={applyFilters}
                availableParties={availableParties}
                availableDistricts={availableDistricts}
                isOpen={sidebarOpen}
                onToggle={handleMobileSidebarClose}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Bangladesh Political Violence Map
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {loading ? (
                                        <span className="flex items-center space-x-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Loading events...</span>
                                        </span>
                                    ) : (
                                        `${filteredEvents.length} events displayed`
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* Dark mode toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title={
                                    darkMode
                                        ? "Switch to light mode"
                                        : "Switch to dark mode"
                                }
                            >
                                {darkMode ? (
                                    <Sun className="w-5 h-5 text-yellow-500" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-600" />
                                )}
                            </button>

                            {/* Filters toggle for desktop */}
                            <button
                                onClick={toggleSidebar}
                                className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Menu className="w-4 h-4" />
                                <span className="text-sm">Filters</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Map Container */}
                <main className="flex-1 relative">
                    <DynamicMapView
                        events={filteredEvents}
                        selectedEvent={selectedEvent}
                        onEventSelect={selectEvent}
                        loading={loading}
                        className="h-full w-full"
                    />
                </main>
            </div>
        </div>
    );
}
