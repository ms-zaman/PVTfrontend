'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ViolenceEvent, FilterOptions, EventsData } from '@/types';
import { apiService } from '@/lib/api';

// Application state interface
interface AppState {
  // Data
  events: ViolenceEvent[];
  filteredEvents: ViolenceEvent[];
  eventsData: EventsData | null;
  
  // UI state
  selectedEvent: ViolenceEvent | null;
  loading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  darkMode: boolean;
  
  // Filters
  filters: FilterOptions;
  
  // Derived data
  availableParties: string[];
  availableDistricts: string[];
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EVENTS_DATA'; payload: EventsData }
  | { type: 'SET_FILTERED_EVENTS'; payload: ViolenceEvent[] }
  | { type: 'SET_SELECTED_EVENT'; payload: ViolenceEvent | null }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_FILTERS'; payload: FilterOptions }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_DARK_MODE' };

// Initial state
const initialState: AppState = {
  events: [],
  filteredEvents: [],
  eventsData: null,
  selectedEvent: null,
  loading: true,
  error: null,
  sidebarOpen: false,
  darkMode: false,
  filters: {
    dateRange: { start: null, end: null },
    politicalParties: [],
    divisions: [],
    districts: [],
    severityLevels: [],
    verifiedOnly: false
  },
  availableParties: [],
  availableDistricts: []
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_EVENTS_DATA':
      const eventsData = action.payload;
      const availableParties = Array.from(
        new Set([
          ...eventsData.events.map(e => e.politicalParty),
          ...eventsData.events.map(e => e.opposingParty)
        ])
      ).filter(Boolean).sort();
      
      const availableDistricts = Array.from(
        new Set(eventsData.events.map(e => e.location.district))
      ).sort();
      
      return {
        ...state,
        eventsData,
        events: eventsData.events,
        filteredEvents: eventsData.events,
        availableParties,
        availableDistricts,
        loading: false,
        error: null
      };
    
    case 'SET_FILTERED_EVENTS':
      return { ...state, filteredEvents: action.payload };
    
    case 'SET_SELECTED_EVENT':
      return { ...state, selectedEvent: action.payload };
    
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    loadEvents: () => Promise<void>;
    applyFilters: (filters: FilterOptions) => Promise<void>;
    selectEvent: (event: ViolenceEvent | null) => void;
    toggleSidebar: () => void;
    toggleDarkMode: () => void;
    setSidebarOpen: (open: boolean) => void;
  };
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load events from API
  const loadEvents = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const eventsData = await apiService.getEvents();
      dispatch({ type: 'SET_EVENTS_DATA', payload: eventsData });
    } catch (error) {
      console.error('Failed to load events:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to load events' 
      });
    }
  };

  // Apply filters and get filtered events
  const applyFilters = async (filters: FilterOptions) => {
    try {
      dispatch({ type: 'SET_FILTERS', payload: filters });
      
      const filteredEvents = await apiService.getFilteredEvents(filters);
      dispatch({ type: 'SET_FILTERED_EVENTS', payload: filteredEvents });
      
      // Clear selected event if it's not in filtered results
      if (state.selectedEvent && !filteredEvents.find(e => e.id === state.selectedEvent!.id)) {
        dispatch({ type: 'SET_SELECTED_EVENT', payload: null });
      }
    } catch (error) {
      console.error('Failed to apply filters:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to apply filters' 
      });
    }
  };

  // Select an event
  const selectEvent = (event: ViolenceEvent | null) => {
    dispatch({ type: 'SET_SELECTED_EVENT', payload: event });
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  // Set sidebar open state
  const setSidebarOpen = (open: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
    
    // Persist dark mode preference
    const newDarkMode = !state.darkMode;
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // Update document class
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      dispatch({ type: 'SET_DARK_MODE', payload: isDark });
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Actions object
  const actions = {
    loadEvents,
    applyFilters,
    selectEvent,
    toggleSidebar,
    toggleDarkMode,
    setSidebarOpen
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
